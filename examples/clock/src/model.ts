import { createModel } from "@prodo/core";

export interface State {
  hours: number;
  minutes: number;
  seconds: number;
}

const now = new Date();
export const initState: State = {
  hours: now.getHours(),
  minutes: now.getMinutes(),
  seconds: now.getSeconds(),
};

export const model = createModel<State>();
export const { action, connect } = model;
export const { state } = model.ctx;
