import { model } from "./model";

const randomId = () => Math.random().toString();

export const newTodo = model.action(
  ({ state, effect }) => (text: string) => {
    const id = effect(randomId)();
    state.todos[id] = {
      text,
      done: false,
    };
  },
  "newTodo",
);

export const toggle = model.action(
  ({ state }) => (id: string) => {
    state.todos[id].done = !state.todos[id].done;
  },
  "toggle",
);

export const deleteItem = model.action(
  ({ state }) => (id: string) => {
    delete state.todos[id];
  },
  "deleteItem",
);

export const deleteAll = model.action(
  ({ state, dispatch }) => () => {
    Object.keys(state.todos).forEach(id => {
      dispatch(deleteItem)(id);
    });
  },
  "deleteAll",
);
