import { createModel } from "@prodo/core";
import localPlugin from "@prodo/local";

export interface Local {
  center: [number, number];
  zoom: number;
}

export const model = createModel<{}>().with(localPlugin<Local>());
export const { state, watch, dispatch, local } = model.ctx;
