import { createStore } from "../src/store";

interface State {
  count: number;
}

const initState: State = {
  count: 0,
};

describe("store", () => {
  it("can create empty store", () => {
    const store = createStore(initState);

    expect(store.state).toBe(initState);
    expect(Object.keys(store.history)).toHaveLength(0);
    expect(store.rootActionsCount).toBe(0);
    expect(store.watchTree.subs.size).toBe(0);
    expect(store.watchTree.esubs.size).toBe(0);
  });
});
