import prodo from "@prodo/core";

interface Counter {
  name: string;
  value: number;
}

export interface State {
  counters: { [key: string]: Counter };
}

export const initialState: State = {
  counters: {},
};

const { action, connect, render } = prodo<State>();

export { action, connect, render };
