import { createModel, effectPlugin } from "@prodo/core";

export interface State {
  todos: { [key: string]: { text: string; done: boolean } };
}

export const model = createModel<State>().with(effectPlugin);
