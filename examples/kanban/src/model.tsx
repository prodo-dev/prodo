import { createModel } from "@prodo/core";
import effect from "@prodo/effect";
import logger from "@prodo/logger";
import { State } from "./types";

export const model = createModel<State>()
  .with(effect)
  .with(logger);

export const { state, watch, dispatch } = model.ctx;
