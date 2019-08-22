import { deleteAll, deleteItem, newTodo, toggle } from "../src/actions";
import { createDispatch } from "./utils";

describe("actions", () => {
  it("adds a todo", async () => {
    const { state, dispatch } = createDispatch({ state: { todos: {} } });

    expect(Object.keys(state.todos)).toHaveLength(0);
    const finalState = await dispatch(newTodo)("foo");
    expect(Object.keys(finalState.todos)).toHaveLength(1);

    const item = Object.values(finalState.todos)[0];
    expect(item.text).toBe("foo");
    expect(item.done).toBe(false);
  });

  it("toggles a todo", async () => {
    const { state, dispatch } = createDispatch({
      state: {
        todos: {
          foo: { text: "foo", done: false },
        },
      },
    });

    expect(state.todos.foo.done).toBe(false);
    const finalState = await dispatch(toggle)("foo");
    expect(finalState.todos.foo.done).toBe(true);
  });

  it("deletes a single todo", async () => {
    const { state, dispatch } = createDispatch({
      state: {
        todos: {
          foo: { text: "foo", done: true },
          bar: { text: "bar", done: true },
        },
      },
    });

    expect(Object.keys(state.todos)).toHaveLength(2);
    const finalState = await dispatch(deleteItem)("foo");
    expect(Object.keys(finalState.todos)).toHaveLength(1);
  });

  it("deletes all todos", async () => {
    const { state, dispatch } = createDispatch({
      state: {
        todos: {
          T1: { text: "", done: false },
          T2: { text: "", done: false },
        },
      },
    });

    expect(Object.keys(state.todos)).toHaveLength(2);
    const finalState = await dispatch(deleteAll)({});
    expect(Object.keys(finalState.todos)).toHaveLength(0);
  });
});
