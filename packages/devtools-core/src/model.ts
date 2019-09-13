import { createModel } from "@prodo/core";

// TODO: action type
export interface State {
  app: {
    state: any;
    actionLog: any[];
  };
  ui: {
    iframe: HTMLIFrameElement | null;
  };
}

export const model = createModel<State>();
export const { state, watch, dispatch } = model.ctx;
