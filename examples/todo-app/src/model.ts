import { createModel } from "@prodo/core";
import effectPlugin from "@prodo/effect";

export interface State {
  todos: { [key: string]: { text: string; done: boolean } };
}

export const model = createModel<State>().with(effectPlugin);
