import { createModel } from "@prodo/core";
import routingPlugin from "@prodo/route";
import loggerPlugin from "@prodo/logger";

// tslint:disable-next-line:no-empty-interface
export interface State {}

export const model = createModel<State>()
  .with(routingPlugin)
  .with(loggerPlugin);
export const { state, route, watch, dispatch } = model.ctx;
