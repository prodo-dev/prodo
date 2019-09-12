import { createModel } from "@prodo/core";

export interface State {
  app: {
    state: any;
  };
  ui: {
    iframe: HTMLIFrameElement | null;
  };
}

export const model = createModel<State>();
export const { state, watch, dispatch } = model.ctx;
