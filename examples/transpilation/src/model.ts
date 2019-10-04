import { createModel } from "@prodo/core";
import loggerPlugin from "@prodo/logger";

export interface State {
  initialized: boolean;
}

export const initState: State = {
  initialized: false,
};

export const model = createModel<State>().with(loggerPlugin);
export const { action, connect } = model;
