import { createModel } from "@prodo/core";
import devToolsPlugin from "@prodo/devtools-plugin";
import effectPlugin from "@prodo/effect";
import loggerPlugin from "@prodo/logger";

export interface State {
  todos: { [key: string]: { text: string; done: boolean } };
}

export const model = createModel<State>()
  .with(effectPlugin)
  .with(devToolsPlugin)
  .with(loggerPlugin);

export const { state, watch, effect, dispatch } = model.ctx;
