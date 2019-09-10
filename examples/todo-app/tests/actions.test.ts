import { deleteAll, deleteItem, newTodo, toggle } from "../src/actions";
import { model } from "../src/model";

import "@babel/polyfill";

describe("actions", () => {
  it("adds a todo", async () => {
    const { dispatch } = model.createStore({
      initState: { todos: {} },
      mockEffects: {
        randomId: ["T1"],
      },
    });

    const { state } = await dispatch(newTodo)("foo");
    expect(Object.keys(state.todos)).toHaveLength(1);

    const item = state.todos.T1;
    expect(item.text).toBe("foo");
    expect(item.done).toBe(false);
  });

  it("toggles a todo", async () => {
    const { dispatch } = model.createStore({
      initState: {
        todos: {
          foo: { text: "foo", done: false },
        },
      },
    });

    const { state } = await dispatch(toggle)("foo");
    expect(state.todos.foo.done).toBe(true);
  });

  it("deletes a single todo", async () => {
    const { dispatch } = model.createStore({
      initState: {
        todos: {
          foo: { text: "foo", done: true },
          bar: { text: "bar", done: true },
        },
      },
    });

    const { state } = await dispatch(deleteItem)("foo");
    expect(Object.keys(state.todos)).toHaveLength(1);
  });

  it("deletes all todos", async () => {
    const { dispatch } = model.createStore({
      initState: {
        todos: {
          T1: { text: "", done: false },
          T2: { text: "", done: false },
        },
      },
    });

    const { state } = await dispatch(deleteAll)();
    expect(Object.keys(state.todos)).toHaveLength(0);
  });
});
