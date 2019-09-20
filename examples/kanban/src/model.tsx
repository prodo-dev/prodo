import { createModel } from "@prodo/core";
import effectPlugin from "@prodo/effect";
import loggerPlugin from "@prodo/logger";
import routePlugin from "@prodo/route";
import { State } from "./types";

export const model = createModel<State>()
  .with(effectPlugin)
  .with(loggerPlugin)
  .with(routePlugin);

export const { state, watch, dispatch, effect, route } = model.ctx;
