import { createModel } from "@prodo/core";
import localPlugin from "@prodo/local-plugin";

export interface State {}

export interface Local {
  center: [number, number];
  zoom: number;
}

export const model = createModel<State>().with(localPlugin<Local>());
