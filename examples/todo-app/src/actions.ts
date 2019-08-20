import { action } from "./store";

const randomId = () => Math.random().toString();

export const newTodo = action("newTodo", (text: string) => ({ state }) => {
  const id = randomId();
  state.todos[id] = {
    text,
    done: false,
  };
});

export const toggle = action("toggle", (id: string) => ({ state }) => {
  state.todos[id].done = !state.todos[id].done;
});

export const deleteItem = action("deleteItem", (id: string) => ({ state }) => {
  delete state.todos[id];
});

export const deleteAll = action("deleteAll", () => ({ state, dispatch }) => {
  Object.keys(state.todos).forEach(id => {
    dispatch(deleteItem)(id);
  });
});
