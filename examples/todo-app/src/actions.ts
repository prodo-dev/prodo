import { dispatch, effect, state } from "./model";

const randomId = () => Math.random().toString();

export const newTodo = (text: string) => {
  const id = effect(randomId)();
  state.todos[id] = {
    text,
    done: false,
  };
};

export const toggle = (id: string) => {
  state.todos[id].done = !state.todos[id].done;
};

export const deleteItem = (id: string) => {
  delete state.todos[id];
};

export const deleteAll = () => {
  Object.keys(state.todos).forEach(id => {
    dispatch(deleteItem)(id);
  });
};
