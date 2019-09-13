import { createModel } from "@prodo/core";
import localPlugin from "../src";

interface Local {
  count: number;
}

const model = createModel<{}>().with(localPlugin<Local>());

const setCount = model.action(({ local }) => (value?: number) => {
  if (!value) {
    local.count = local.count;
    return;
  }

  local.count = value;
});

const increaseCount = model.action(({ local }) => (amount: number) => {
  local.count = (local.count || 0) + amount;
});

describe("local plugin", () => {
  it("inits local storage with init value", async () => {
    const { store } = model.createStore({
      initState: {},
      initLocal: { count: 10 },
    });

    expect(store.universe.local.count).toBe(10);
  });

  it("uses fixtures", async () => {
    const { store } = model.createStore({
      initState: {},
      localFixture: {
        count: 200,
      },
    });

    expect(store.universe.local.count).toBe(undefined);
    const finalUniverse = await store.dispatch(setCount)();
    expect(finalUniverse.local.count).toBe(200);
  });

  it("sets local storage value", async () => {
    const { store } = model.createStore({
      initState: {},
      localFixture: {},
    });

    const finalUniverse = await store.dispatch(setCount)(100);
    expect(finalUniverse.local.count).toBe(100);
  });

  it("updates local storage value with initLocal", async () => {
    const { store } = model.createStore({
      initState: {},
      localFixture: {},
      initLocal: {
        count: 300,
      },
    });

    expect(store.universe.local.count).toBe(300);
    const finalUniverse = await store.dispatch(increaseCount)(202);
    expect(finalUniverse.local.count).toBe(502);
  });

  it("sets local storage value with fixture", async () => {
    const { store } = model.createStore({
      initState: {},
      localFixture: {
        count: 2,
      },
    });

    expect(store.universe.local.count).toBe(undefined);
    const finalUniverse = await store.dispatch(increaseCount)(400);
    expect(finalUniverse.local.count).toBe(402);
  });

  it("sets local storage value without initLocal or fixture", async () => {
    const { store } = model.createStore({
      initState: {},
      localFixture: {},
    });

    expect(store.universe.local.count).toBe(undefined);
    const finalUniverse = await store.dispatch(increaseCount)(1000);
    expect(finalUniverse.local.count).toBe(1000);
  });
});
