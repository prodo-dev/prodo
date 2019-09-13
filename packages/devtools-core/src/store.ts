import { State } from "./model";

export const initState: State = {
  app: {
    state: {},
    actionLog: [],
  },
  ui: {
    iframe: null,
  },
};
