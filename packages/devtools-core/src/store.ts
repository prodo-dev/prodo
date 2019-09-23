import { State } from "./model";

export const initState: State = {
  app: {
    state: {},
    actionLog: [],
    renderLog: [],
  },
  ui: {
    iframe: null,
  },
};
