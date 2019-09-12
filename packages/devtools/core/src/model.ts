import { createModel } from "@prodo/core";

export interface State {}

export const model = createModel<State>();
export const { state, watch, dispatch } = model.ctx;
