import { createModel } from "../src";

interface State {
  count: number;
}

const initState: State = {
  count: 0,
};

const model = createModel<State>();

describe("store", () => {
  it("can create empty store", () => {
    const store = model.createStore({ initState });

    expect(store.universe.state).toBe(initState);
    expect(Object.keys(store.history)).toHaveLength(0);
    expect(store.watchTree.subs.size).toBe(0);
    expect(store.watchTree.esubs.size).toBe(0);
    expect(Object.keys(store.streamStates)).toHaveLength(0);
  });
});
