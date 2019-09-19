import { createModel } from "@prodo/core";
import { Action, Render } from "./types";

export interface State {
  app: {
    state: any;
    actionLog: Action[];
    renderLog: Render[];
  };
  ui: {
    iframe: HTMLIFrameElement | null;
  };
}

export const model = createModel<State>();
export const { state, watch, dispatch } = model.ctx;
