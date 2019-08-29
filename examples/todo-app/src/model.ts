import { createModel } from "@prodo/core";
import effectPlugin from "@prodo/effect-plugin";

export interface State {
  todos: { [key: string]: { text: string; done: boolean } };
}

export const model = createModel<State>().with(effectPlugin);
