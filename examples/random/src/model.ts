import { createModel } from "@prodo/core";
import randomPlugin from "@prodo/random";

export interface State {
  count: number;
}

export const initState: State = {
  count: 0,
};

export const model = createModel<State>().with(randomPlugin);
export const { action, connect } = model;
export const { state, random } = model.ctx;
