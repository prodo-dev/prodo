import produce from "immer";
import * as _ from "lodash";
import * as React from "react";
import { ProdoProvider } from ".";
import { completeEvent, startEvent } from "./events";
import { ProdoPlugin } from "./plugins";
import {
  BaseStore,
  Origin,
  PluginDispatch,
  Provider,
  WatchTree,
} from "./types";
import { submitPatches } from "./watch";

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
      (func as any).__pluginName || "(user)",
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
        p._internals.onCompleteEvent(event, config);
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

  // TODO: is this the right place...
  window.addEventListener("message", event => {
    if (event.data.destination === "app") {
      if (event.data.type === "updateState") {
        const prevUniverse = store.universe;
        if (
          _.get(store.universe.state, event.data.contents.path) !== undefined
        ) {
          _.set(
            store.universe.state as any,
            event.data.contents.path,
            event.data.contents.newValue,
          );
          const path = event.data.contents.path;
          path.unshift("state");
          submitPatches(store, store.universe, {
            actionName: "updateState",
            id: "updateState",
            parentId: null,
            args: {},
            patches: [
              {
                op: "replace",
                path,
                value: event.data.contents.newValue,
              },
            ],
            prevUniverse,
            nextUniverse: store.universe,
            nextActions: [],
          });
          console.log("Updated?", store.universe.state, event.data.contents);
        }
      } else {
        // tslint:disable-next-line:no-console
        console.log("Got message with unimplemented type", event.data);
      }
    }
  });

  return {
    store,
    Provider,
  };
};
