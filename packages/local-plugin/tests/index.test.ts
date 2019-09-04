import { createModel } from "@prodo/core";
import localPlugin from "../src";

interface Local {
  count: number;
}

const model = createModel<{}>().with(localPlugin<Local>());

const setCount = model.action(({ local }) => (value: number) => {
  local.count = value;
});

describe("local plugin", () => {
  it.skip("inits local storage with init value", async () => {
    const store = model.createStore({
      initState: {},
      initLocal: { count: 10 },
      // mockLocal: true,
    });

    expect(store.universe.local.count).toBe(10);
  });

  it.skip("sets local storage value", async () => {
    const store = model.createStore({
      initState: {},
      initLocal: { count: 0 },
      // mockLocal: true,
    });

    expect(store.universe.local.count).toBe(0);
    const finalUniverse = await store.dispatch(setCount)(100);
    expect(finalUniverse.local.count).toBe(100);
  });
});
