import { toggle } from "../../../src/actions";
import { model } from "../../../src/model";

describe("actions", () => {
  it("a2", async () => {
    const { store } = model.createStore({
      initState: { todos: { T1: { text: "milk", done: false } } },
      mockEffects: {}
    });

    await store.dispatch(toggle)("T1");
    await store.dispatch(toggle)("T1");
    expect(store.universe.state).toEqual({
      todos: { T1: { text: "milk", done: false } }
    });
  });
});
