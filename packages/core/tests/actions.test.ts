import prodo, { createTestDispatch } from "../src";

interface State {
  count: number;
  foo: string;
}

const initialState: State = {
  count: 0,
  foo: "foo",
};

const { action } = prodo<State>();
const createDispatch = createTestDispatch<State>();

const changeFoo = action("changeFoo", () => ({ state }) => {
  state.foo = "bar";
});

const dummy2 = action("dummy2", () => async ({ dispatch }) => {
  await new Promise(r => setTimeout(r, 200));
  dispatch(changeFoo)({});
});

const dummy = action("dummy", () => ({ dispatch }) => {
  dispatch(dummy2)({});
});

const changeCount = action("changeCount", (amount: number) => ({ state }) => {
  state.count += amount;
});

describe("actions", () => {
  it("has correct state after calling action", async () => {
    const { dispatch, state } = createDispatch({ state: initialState });

    expect(state.foo).toBe("foo");
    const finalState = await dispatch(changeFoo)({});
    expect(finalState.foo).toBe("bar");
  });

  it("has correct state after calling action that calls an async action", async () => {
    const { dispatch, state } = createDispatch({ state: initialState });

    expect(state.foo).toBe("foo");
    const finalState = await dispatch(dummy)({});
    expect(finalState.foo).toBe("bar");
  });

  it("has correct state after calling multiple actions", async () => {
    const { dispatch, state } = createDispatch({ state: initialState });

    expect(state.count).toBe(0);

    await dispatch(changeCount)(1);
    await dispatch(changeCount)(1);
    await dispatch(changeCount)(1);
    await dispatch(changeCount)(1);
    await dispatch(changeCount)(1);

    await dispatch(changeCount)(-1);
    await dispatch(changeCount)(-1);
    const finalState = await dispatch(changeCount)(-1);

    expect(finalState.count).toBe(2);
  });
});
