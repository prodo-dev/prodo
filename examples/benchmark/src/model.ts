import { createModel } from "@prodo/core";

export interface Box {
  value: boolean;
}

export type State = Box[];

export const model = createModel<State>();
