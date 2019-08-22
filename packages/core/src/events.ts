import { applyPatches } from "immer";
import { Event, Origin, Store, streamSymbol } from "./types";
import { joinPath } from "./utils";
import { submitPatches } from "./watch";

export const startEvent = (
  store: Store<any>,
  actionName: string,
  args: any,
  origin?: { parentId: string; id: string },
) => {
  const id = origin != null ? origin.id : `${store.rootActionsCount++}`;
  const parentId = origin != null ? origin.parentId : null;
  const event: Event = {
    id,
    parentId,
    isRoot: origin == null,
    actionName,
    args,
    timeStart: Date.now(),
    stateBefore: store.state,
    patches: [],
    nextActions: [],
    effectsLog: [],
    logs: [],
    runtimeError: false,
  };

  if (store.trackHistory) {
    store.history[event.id] = event;
  }

  store.eventsOrder.push({ type: "start", eventId: event.id });

  if (store.watchForComplete) {
    store.watchForComplete.count += 1;
  }

  return event;
};

export const completeEvent = (
  store: Store<any>,
  event: Event,
  error?: Error,
): void => {
  doCompleteEvent(store, event, error);
};

export const doCompleteEvent = (
  store: Store<any>,
  event: Event,
  error?: Error,
): void => {
  event.timeEnd = Date.now();
  store.eventsOrder.push({ type: "end", eventId: event.id });

  if (error) {
    event.runtimeError = true;
    event.logs.push({
      severity: "runtime error",
      message: error.message,
      stack: error.stack,
    });

    return;
  }

  const patches = event.patches
    .map(patch => {
      const path = joinPath(patch.path.map(v => v.toString()));
      const streamState = store.streamStates[path];

      if (streamState && (patch.op === "remove" || patch.value[streamSymbol])) {
        // replacing or removing subscription
        streamState.unsubscribe();
      }

      if (patch.value && patch.value[streamSymbol]) {
        const cb = (value: any) => {
          const event = startEvent(store, "Subscription", {});
          event.patches = [{ op: "replace", path: patch.path, value }];
          completeEvent(store, event);
        };

        store.streamStates[path] = patch.value.subscribe(cb);

        return undefined;
      }

      return patch;
    })
    .filter(p => p !== undefined);

  event.stateAfter = applyPatches(store.state, patches);
  store.state = event.stateAfter;
  submitPatches(store, event.patches);

  event.nextActions.forEach(({ func, args }, index) => {
    const origin: Origin = {
      parentId: event.id,
      id: `${event.id}/${index}`,
    };

    func(args)(store, origin);
  });

  if (store.watchForComplete) {
    store.watchForComplete.count -= 1;

    if (store.watchForComplete.count === 0) {
      store.watchForComplete.cb();
    }
  }
};
