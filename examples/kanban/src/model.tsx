import { createModel } from "@prodo/core";
import effect from "@prodo/effect";
import { State } from "./types";
export const model = createModel<State>().with(effect);
export const { state, watch, dispatch } = model.ctx;
