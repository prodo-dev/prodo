import { dispatch, effect, state } from "./model";
import { randomId, fetchEmoji } from "./effects";

export const newTodo = async (text: string) => {
  const id = effect(randomId)();
  const emoji = await effect(fetchEmoji)();
  state.todos[id] = {
    emoji,
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
