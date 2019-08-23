import { createBaseModel } from "../src";

interface State {
  count: number;
  foo: string;
}

const initState: State = {
  count: 0,
  foo: "foo",
};

const model = createBaseModel<State>();

const changeFoo = model.action(
  ({ state }) => () => {
    state.foo = "bar";
  },
  "changeFoo",
);

const dummy2 = model.action(
  ({ dispatch }) => async () => {
    await new Promise(r => setTimeout(r, 200));
    dispatch(changeFoo)({});
  },
  "dummy2",
);

const dummy = model.action(
  ({ dispatch }) => () => {
    dispatch(dummy2)({});
  },
  "dummy",
);

const changeCount = model.action(
  ({ state }) => (amount: number) => {
    state.count += amount;
  },
  "changeCount",
);

describe("actions", () => {
  it("has correct state after calling action", async () => {
    const { dispatch, universe } = model.createStore({ initState });

    expect(universe.state.foo).toBe("foo");
    const finalUniverse = await dispatch(changeFoo)({});
    expect(finalUniverse.state.foo).toBe("bar");
  });

  it("has correct state after calling action that calls an async action", async () => {
    const { dispatch, universe } = model.createStore({ initState });

    expect(universe.state.foo).toBe("foo");
    const finalUniverse = await dispatch(dummy)({});
    expect(finalUniverse.state.foo).toBe("bar");
  });

  it("has correct state after calling multiple actions", async () => {
    const { dispatch, universe } = model.createStore({ initState });
    const state = universe.state;

    expect(state.count).toBe(0);

    await dispatch(changeCount)(1);
    await dispatch(changeCount)(1);
    await dispatch(changeCount)(1);
    await dispatch(changeCount)(1);
    await dispatch(changeCount)(1);

    await dispatch(changeCount)(-1);
    await dispatch(changeCount)(-1);
    const finalUniverse = await dispatch(changeCount)(-1);

    expect(finalUniverse.state.count).toBe(2);
  });
});
