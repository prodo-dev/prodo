import { createModel } from "@prodo/core";
import effectPlugin from "@prodo/effect";
import loggerPlugin from "@prodo/logger";
import { State } from "./types";

export const model = createModel<State>()
  .with(effectPlugin)
  .with(loggerPlugin);

export const { state, watch, dispatch, effect } = model.ctx;
