import { createModel } from "@prodo/core";
import effect from "@prodo/effect";
import logger from "@prodo/logger";
import firestore from "@prodo/firestore";
import { State, DB } from "./types";

export const model = createModel<State>()
  .with(effect)
  .with(firestore<DB>())
  .with(logger);

export const { state, watch, dispatch, db } = model.ctx;
