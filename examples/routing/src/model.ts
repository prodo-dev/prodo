import { createModel } from "@prodo/core";
import devToolsPlugin from "@prodo/devtools";
import loggerPlugin from "@prodo/logger";
import routingPlugin from "@prodo/route";

// tslint:disable-next-line:no-empty-interface
export interface State {}

export const model = createModel<State>()
  .with(routingPlugin)
  .with(loggerPlugin)
  .with(devToolsPlugin<State>());

export const { state, route, watch, dispatch } = model.ctx;
