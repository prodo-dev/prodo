import { createModel } from "../src";

interface State {
  count: number;
  counts: { [key: string]: number };
}

const initState: State = {
  count: 0,
  counts: {},
};

const model = createModel<State>();

describe("store", () => {
  it("can create empty store", () => {
    const { store } = model.createStore({ initState });

    expect(store.universe.state).toBe(initState);
    expect(Object.keys(store.history)).toHaveLength(0);
    expect(store.watchTree.subs.size).toBe(0);
    expect(store.watchTree.esubs.size).toBe(0);
  });

  it("can dispatch and await multiple actions", async () => {
    const { store } = model.createStore({ initState });

    const action = model.action(({ state }) => async (key: string) => {
      await new Promise(r => setTimeout(r, 100));
      state.counts[key] = 1;
    });

    const results = await Promise.all([
      store.dispatch(action)("foo"),
      store.dispatch(action)("bar"),
    ]);

    results.forEach(({ state }) => {
      expect(state.counts).toEqual({ foo: 1, bar: 1 });
    });
  });
});
