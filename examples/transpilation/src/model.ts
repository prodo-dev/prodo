import { createModel } from "@prodo/core";

export interface State {
  initialized: boolean;
}

export const initState: State = {
  initialized: false,
};

export const model = createModel<State>();
export const { action, connect } = model;
export const { dispatch, state, watch } = model.ctx;
