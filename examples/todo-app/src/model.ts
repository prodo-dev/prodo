import { createModel } from "@prodo/core";
import effectPlugin from "@prodo/effect";
import loggerPlugin from "@prodo/logger";
import devToolsPlugin from "../../../packages/devtools-plugin/lib";

export interface State {
  todos: { [key: string]: { text: string; done: boolean } };
}

export const model = createModel<State>()
  .with(effectPlugin)
  .with(loggerPlugin)
  .with(devToolsPlugin);

export const { state, watch, effect, dispatch } = model.ctx;
