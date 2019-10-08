import { createModel } from "@prodo/core";
import localPlugin from "@prodo/local";
import loggerPlugin from "@prodo/logger";

export interface Local {
  center: [number, number];
  zoom: number;
}

export const model = createModel<{}>()
  .with(localPlugin<Local>())
  .with(loggerPlugin);
export const { state, watch, dispatch, local } = model.ctx;
