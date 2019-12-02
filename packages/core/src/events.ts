import { applyPatches } from "immer";
import { Event, Origin, Store } from "./types";
import { submitPatches } from "./watch";

export const startEvent = (
  store: Omit<Store<any, any>, "exec">,
  actionName: string,
  pluginName: string,
  args: any,
  origin: Origin,
): Event => {
  const event: Event = {
    id: origin.id,
    parentId: origin.parentId,
    actionName,
    pluginName,
    args,
    nextActions: [],
    patches: [],
    prevUniverse: store.universe,
  };

  if (store.trackHistory) {
    if (store.history.length >= 1024) {
      store.history.shift();
    }
    store.history.push(event);
  }

  return event;
};

export const completeEvent = (event: Event, store: Store<any, any>): void => {
  const nextUniverse = applyPatches(store.universe, event.patches);
  store.universe = nextUniverse;
  event.nextUniverse = nextUniverse;
  submitPatches(store, store.universe, event);

  event.nextActions.forEach(({ func, args, origin }) => {
    if (store.watchForComplete) {
      store.watchForComplete.count += 1;
    }
    setTimeout(() => store.exec(origin, func, ...args), 0);
  });

  if (store.watchForComplete) {
    store.watchForComplete.count -= 1;

    if (store.watchForComplete.count === 0) {
      store.watchForComplete.cb();
    }
  }
};
