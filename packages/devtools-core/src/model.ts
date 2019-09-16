import { createModel } from "@prodo/core";
import loggerPlugin from "@prodo/logger";
import { Action } from "./types";

export interface State {
  app: {
    state: any;
    actionLog: Action[];
  };
  ui: {
    iframe: HTMLIFrameElement | null;
  };
}

export const model = createModel<State>().with(loggerPlugin);
export const { state, watch, dispatch } = model.ctx;
