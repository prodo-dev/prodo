import { applyPatches } from "immer";
import { Event, Origin, Store } from "./types";
import { submitPatches } from "./watch";

export const startEvent = (
  store: Omit<Store<any, any>, "exec">,
  actionName: string,
  origin: Origin,
): Event => {
  const event: Event = {
    id: origin.id,
    parentId: origin.parentId,
    actionName,
    nextActions: [],
    patches: [],
    prevUniverse: store.universe,
    timeStart: Date.now(),
  };

  if (store.trackHistory) {
    store.history[event.id] = event;
  }

  if (store.watchForComplete) {
    store.watchForComplete.count += 1;
  }

  return event;
};

export const completeEvent = (event: Event, store: Store<any, any>): void => {
  event.timeEnd = Date.now();
  // store.eventsOrder.push({ type: "end", eventId: event.id });

  // if (error) {
  // event.runtimeError = true;
  // event.logs.push({
  //   severity: "runtime error",
  //   message: error.message,
  //   stack: error.stack,
  // });
  //
  //   return;
  // }

  // const patches = event.patches
  //   .map(patch => {
  //     const path = joinPath(patch.path.map(v => v.toString()));
  //     const streamState = store.streamStates[path];

  //     if (streamState && (patch.op === "remove" || patch.value[streamSymbol])) {
  //       // replacing or removing subscription
  //       streamState.unsubscribe();
  //     }

  //     if (patch.value && patch.value[streamSymbol]) {
  //       const cb = (value: any) => {
  //         const event = startEvent(store, "Subscription", {});
  //         event.patches = [{ op: "replace", path: patch.path, value }];
  //         completeEvent(store, event);
  //       };

  //       store.streamStates[path] = patch.value.stream.subscribe(cb);

  //       return undefined;
  //     }

  //     return patch;
  //   })
  //   .filter(p => p !== undefined);

  const nextUniverse = applyPatches(store.universe, event.patches);
  Object.assign(store.universe, nextUniverse);
  event.nextUniverse = nextUniverse;
  submitPatches(store.watchTree, store.universe, event.patches);

  event.nextActions.map(({ func, args, origin }) =>
    store.exec(func, args, origin),
  );

  if (store.watchForComplete) {
    store.watchForComplete.count -= 1;

    if (store.watchForComplete.count === 0) {
      store.watchForComplete.cb();
    }
  }
};
