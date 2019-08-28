import produce from "immer";
import { completeEvent, startEvent } from "./events";
import { stream } from "./streams";
import { BaseStore, Origin, ProdoPlugin, WatchTree } from "./types";

export const createStore = <State>(
  config: { initState: State },
  plugins: Array<ProdoPlugin<any, any, any, any>>,
): BaseStore<State> => {
  const universe = { state: config.initState };

  const watchTree: WatchTree = {
    subs: new Set(),
    esubs: new Set(),
    children: {},
  };

  const store: BaseStore<State> = {
    config,
    history: {},
    universe,
    watchTree,
    streamStates: {},
    trackHistory: true,
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
      universe,
      async u => {
        const ctx = {
          state: u.state,
          stream,
          dispatch: <A>(func: (a: A) => void) => (args: A) => {
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

        plugins.forEach(p => {
          if (p.prepareActionCtx) {
            p.prepareActionCtx(ctx, event, config);
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

    return universe;
  };

  return store;
};
