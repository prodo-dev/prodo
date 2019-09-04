import { createModel } from "@prodo/core";
import effectPlugin from "@prodo/effect-plugin";

export interface State {
  grid: { [key: string]: boolean };
}

export const model = createModel<State>().with(effectPlugin);
