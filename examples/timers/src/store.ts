import { createModel } from "@prodo/core";

interface Counter {
  name: string;
  value: number;
}

export interface State {
  counters: { [key: string]: Counter };
}

export const initState: State = {
  counters: {},
};

export const model = createModel<State>();
