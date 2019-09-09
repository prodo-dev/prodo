import { createModel } from "@prodo/core";
import effectPlugin from "../src";

interface State {
  count: number;
}

const model = createModel<State>().with(effectPlugin);

const random = () => Math.random() * 10;

const randomInc = model.action(({ state, effect }) => () => {
  state.count = effect(random)();
});

describe("effect plugin", () => {
  it("should use mocked value", async () => {
    const { store } = model.createStore({
      initState: {
        count: 0,
      },
      mockEffects: {
        random: [10, 64],
      },
    });

    let state = store.universe.state;
    expect(state.count).toBe(0);

    state = (await store.dispatch(randomInc)()).state;
    expect(state.count).toBe(10);

    state = (await store.dispatch(randomInc)()).state;
    expect(state.count).toBe(64);
  });
});
