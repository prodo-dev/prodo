import prodo from "@prodo/core";

export type State = {
  todos: { [key: string]: { text: string; done: boolean } };
};

export const initialState: State = {
  todos: {
    T1: { text: "milk", done: false },
  },
};

const { action, connect, render } = prodo<State>();

export { action, connect, render };
