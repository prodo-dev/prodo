import { Event, Store, Origin } from "./types";
import { applyPatches } from "immer";
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

  event.stateAfter = applyPatches(store.state, event.patches);
  store.state = event.stateAfter;
  submitPatches(store, event.patches);

  event.nextActions.forEach(({ func, args }, index) => {
    const origin: Origin = {
      parentId: event.id,
      id: `${event.id}/${index}`,
    };

    func(args)(store, origin);
  });
};
