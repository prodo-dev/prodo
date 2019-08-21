import { Store } from "./types";

export const createStore = <S>(initState: S): Store<S> => ({
  state: initState,
  history: {},
  rootActionsCount: 0,
  watchTree: {
    subs: new Set(),
    esubs: new Set(),
    children: {},
  },
  eventsOrder: [],
  trackHistory: true,
  streamStates: {},
});
