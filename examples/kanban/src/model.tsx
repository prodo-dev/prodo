import { createModel } from "@prodo/core";
import devToolsPlugin from "@prodo/devtools";
import effectPlugin from "@prodo/effect";
import loggerPlugin from "@prodo/logger";
import routePlugin from "@prodo/route";
import { State } from "./types";

export const model = createModel<State>()
  .with(effectPlugin)
  .with(loggerPlugin)
  .with(routePlugin)
  .with(devToolsPlugin<State>());

export const { state, watch, dispatch, effect, route } = model.ctx;
