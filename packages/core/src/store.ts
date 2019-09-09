import produce from "immer";
import * as React from "react";
import { ProdoProvider } from ".";
import { completeEvent, startEvent } from "./events";
import {
  BaseStore,
  Origin,
  PluginDispatch,
  ProdoPlugin,
  Provider,
  WatchTree,
} from "./types";

const initPlugins = (
  universe: any,
  config: any,
  plugins: Array<ProdoPlugin<any, any, any, any>>,
): any =>
  produce(universe, u => {
    plugins.forEach(p => {
      if (p.init != null) {
        p.init(config, u);
      }
    });
  });

const createProvider = <State>(
  store: BaseStore<State>,
  plugins: Array<ProdoPlugin<any, any, any, any>>,
): Provider =>
  plugins.reduce(
    (
      next: React.ComponentType<{ children: React.ReactNode }>,
      plugin: ProdoPlugin<any, any, any, any>,
    ) =>
      plugin.Provider
        ? ({ children }: { children: React.ReactNode }) =>
            React.createElement(plugin.Provider, {
              children: React.createElement(next, { children }),
            })
        : next,
    (({ children }: { children: React.ReactNode }) =>
      React.createElement(ProdoProvider, {
        value: store,
        children,
      })) as Provider,
  );

export const createStore = <State>(
  config: { initState: State },
  plugins: Array<ProdoPlugin<any, any, any, any>>,
): {
  store: BaseStore<State>;
  Provider: React.ComponentType<{ children: React.ReactNode }>;
} => {
  const universe = initPlugins({ state: config.initState }, config, plugins);

  const watchTree: WatchTree = {
    subs: new Set(),
    esubs: new Set(),
    children: {},
  };

  const store: BaseStore<State> = {
    config,
    history: [],
    universe,
    watchTree,
    trackHistory: true,
    plugins,
    exec: null as any,
    dispatch: null as any,
  };

  store.exec = async <A extends any[]>(
    origin: Origin,
    func: (...args: A) => void,
    ...args: A
  ) => {
    const event = startEvent(
      store,
      (func as any).__name || "(unnamed)",
      origin,
    );

    await produce(
      store.universe,
      async u => {
        const ctx = {
          state: u.state,
          dispatch: <A extends any[]>(func: (...a: A) => void) => (
            ...args: A
          ) => {
            event.nextActions.push({
              func,
              args,
              origin: {
                parentId: event.id,
                id: `${event.id}/${event.nextActions.length}`,
              },
            });
          },
        };

        const createRootDispatch = (name: string): PluginDispatch<any> => <
          A extends any[]
        >(
          func: (ctx: any) => (...args: A) => void,
        ) => (...args) =>
          store.exec({ id: name, parentId: null }, func as any, ...args);

        plugins.forEach(p => {
          if (p.prepareActionCtx) {
            (ctx as any).rootDispatch = createRootDispatch(p.name);
            p.prepareActionCtx(
              {
                ctx,
                universe: u,
                event,
              },
              config,
            );
          }
        });

        await (func as any)(ctx)(...args);
      },
      p => {
        event.patches = p;
      },
    );

    completeEvent(event, store);
  };

  store.dispatch = <A extends any[]>(func: (...args: A) => void) => async (
    ...args: A
  ) => {
    const actionsCompleted = new Promise(async r => {
      store.watchForComplete = {
        count: 0,
        cb: r,
      };
    });

    await store.exec(
      {
        id: "dispatch",
        parentId: null,
      },
      func,
      ...args,
    );

    await actionsCompleted;
    store.watchForComplete = undefined;

    return store.universe;
  };

  const Provider = createProvider(store, plugins);

  return { store, Provider };
};
