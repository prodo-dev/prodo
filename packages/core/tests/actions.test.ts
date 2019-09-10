import { createModel } from "../src";

interface State {
  count: number;
  foo: string;
}

const initState: State = {
  count: 0,
  foo: "foo",
};

const model = createModel<State>();

const changeFoo = model.action(
  ({ state }) => () => {
    state.foo = "bar";
  },
  "changeFoo",
);

const dummy2 = model.action(
  ({ dispatch }) => async () => {
    await new Promise(r => setTimeout(r, 200));
    dispatch(changeFoo)();
  },
  "dummy2",
);

const dummy = model.action(
  ({ dispatch }) => () => {
    dispatch(dummy2)();
  },
  "dummy",
);

const changeCount = model.action(
  ({ state }) => (amount: number) => {
    state.count += amount;
  },
  "changeCount",
);

const add = model.action(({ state }) => (a: number, b: number) => {
  state.count = a + b;
});

describe("actions", () => {
  it("has correct state after calling action", async () => {
    const { store } = model.createStore({ initState });

    expect(store.universe.state.foo).toBe("foo");
    const finalUniverse = await store.dispatch(changeFoo)();
    expect(finalUniverse.state.foo).toBe("bar");
  });

  it("has correct state after calling action that calls an async action", async () => {
    const { store } = model.createStore({ initState });

    expect(store.universe.state.foo).toBe("foo");
    const finalUniverse = await store.dispatch(dummy)();
    expect(finalUniverse.state.foo).toBe("bar");
  });

  it("has correct state after calling multiple actions", async () => {
    const { store } = model.createStore({ initState });
    const state = store.universe.state;

    expect(state.count).toBe(0);

    await store.dispatch(changeCount)(1);
    await store.dispatch(changeCount)(1);
    await store.dispatch(changeCount)(1);
    await store.dispatch(changeCount)(1);
    await store.dispatch(changeCount)(1);

    await store.dispatch(changeCount)(-1);
    await store.dispatch(changeCount)(-1);
    const finalUniverse = await store.dispatch(changeCount)(-1);

    expect(finalUniverse.state.count).toBe(2);
  });

  it("has correct state after calling action with multiple params", async () => {
    const { store } = model.createStore({ initState });

    expect(store.universe.state.count).toBe(0);
    const finalUniverse = await store.dispatch(add)(1, 2);
    expect(finalUniverse.state.count).toBe(3);
  });
});
