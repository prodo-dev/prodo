import { createModel, localPlugin } from "@prodo/core";

export interface State {}

export interface Local {
  center: [number, number];
  zoom: number;
}

export const model = createModel<State>().with(localPlugin<Local>());
