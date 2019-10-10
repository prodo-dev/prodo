import { State } from "./model";

export const initState: State = {
  app: {
    universe: {},
    actionLog: [],
    renderLog: [],
  },
  ui: {
    iframe: null,
  },
};
