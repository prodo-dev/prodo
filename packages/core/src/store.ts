import produce from "immer";
import * as React from "react";
import { ProdoProvider } from ".";
import { completeEvent, startEvent } from "./events";
import {
  BaseStore,
  Origin,
  PluginDispatch,
  Provider,
  WatchTree,
} from "./types";
import { ProdoPlugin } from "./plugins";

const initPlugins = (
  universe: any,
  config: any,
  plugins: Array<ProdoPlugin<any, any, any, any>>,
): any =>
  produce(universe, u => {
    plugins.forEach(p => {
      if (p._internals.init != null) {
        p._internals.init(config, u);
      }
    });
  });

const createProvider = <State>(store: BaseStore<State>): Provider => ({
  children,
}: {
  children: React.ReactNode;
}) =>
  React.createElement(ProdoProvider, {
    value: store,
    children,
  });

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
      args,
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
              func: func as any,
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
          if (p._internals.actionCtx) {
            (ctx as any).rootDispatch = createRootDispatch(p.name);
            p._internals.actionCtx(
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
    plugins.forEach(p => {
      if (p._internals.onCompleteEvent) {
        p._internals.onCompleteEvent(event);
      }
    });
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

  const Provider = createProvider(store);

  return {
    store,
    Provider,
  };
};
