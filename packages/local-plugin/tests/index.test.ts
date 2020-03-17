import { createModel } from "@prodo/core";
import localPlugin from "../src";
import { createInMemoryLocalStorage, serializeKey } from "../src/utils";

interface Local {
  count: number;
  obj: { a: string };
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

const deleteCount = model.action(({ local }) => () => {
  delete local.count;
});

const setObj = model.action(({ local }) => (value: string) => {
  if (!local.obj) {
    local.obj = { a: value };
  } else {
    local.obj.a = value;
  }
});

describe("local plugin", () => {
  it("inits local storage with init value", async () => {
    const { store } = model.createStore({
      initState: {},
      initLocal: { count: 10 },
    });

    expect(store.universe.local.count).toBe(10);
  });

  it("sets init values to local storage", async () => {
    const localStorage = createInMemoryLocalStorage();
    model.createStore({
      initState: {},
      initLocal: { count: 10 },
      overrideStorage: localStorage,
    });

    expect(localStorage.getItem(serializeKey("count"))).toBe("10");
  });

  it("doesn't override local storage with init values", async () => {
    const localStorage = createInMemoryLocalStorage();
    localStorage.setItem(serializeKey("count"), JSON.stringify(20));

    model.createStore({
      initState: {},
      initLocal: { count: 10 },
      overrideStorage: localStorage,
    });

    expect(localStorage.getItem(serializeKey("count"))).toBe("20");
  });

  it("loads existing values into the universe", async () => {
    const localStorage = createInMemoryLocalStorage();
    localStorage.setItem(serializeKey("count"), JSON.stringify(200));
    const { store } = model.createStore({
      initState: {},
      overrideStorage: localStorage,
    });

    expect(store.universe.local.count).toBe(200);
  });

  it("sets local storage value", async () => {
    const localStorage = createInMemoryLocalStorage();
    const { store } = model.createStore({
      initState: {},
      initLocal: {},
      overrideStorage: localStorage,
    });

    const finalUniverse = await store.dispatch(setCount)(100);
    expect(finalUniverse.local.count).toBe(100);

    expect(localStorage.getItem(serializeKey("count"))).toBe("100");
  });

  it("sets nested local storage value without initLocal", async () => {
    const localStorage = createInMemoryLocalStorage();
    const { store } = model.createStore({
      initState: {},
      initLocal: {},
      overrideStorage: localStorage,
    });

    expect(store.universe.local.obj).toBe(undefined);
    const finalUniverse = await store.dispatch(setObj)("foo");
    expect(finalUniverse.local.obj!.a).toBe("foo");

    const storedValue = localStorage.getItem(serializeKey("obj"));
    expect(storedValue).not.toBeNull();
    expect(JSON.parse(storedValue)).toEqual({ a: "foo" });
  });

  it("sets nested local storage value with initLocal", async () => {
    const localStorage = createInMemoryLocalStorage();
    const { store } = model.createStore({
      initState: {},
      initLocal: {
        obj: {
          a: "foo",
        },
      },
      overrideStorage: localStorage,
    });

    expect(store.universe.local.obj!.a).toBe("foo");
    const finalUniverse = await store.dispatch(setObj)("bar");
    expect(finalUniverse.local.obj!.a).toBe("bar");
  });

  it("updates local storage value with initLocal", async () => {
    const localStorage = createInMemoryLocalStorage();

    const { store } = model.createStore({
      initState: {},
      initLocal: {
        count: 300,
      },
      overrideStorage: localStorage,
    });

    expect(store.universe.local.count).toBe(300);
    const finalUniverse = await store.dispatch(increaseCount)(202);
    expect(finalUniverse.local.count).toBe(502);
  });

  it("sets local storage value without initLocal or fixture", async () => {
    const localStorage = createInMemoryLocalStorage();

    const { store } = model.createStore({
      initState: {},
      overrideStorage: localStorage,
    });

    expect(store.universe.local.count).toBe(undefined);
    const finalUniverse = await store.dispatch(increaseCount)(1000);
    expect(finalUniverse.local.count).toBe(1000);

    expect(localStorage.getItem(serializeKey("count"))).toBe("1000");
  });

  it("deletes a local storage value with default", async () => {
    const localStorage = createInMemoryLocalStorage();
    localStorage.setItem(serializeKey("count"), JSON.stringify(10));

    const { store } = model.createStore({
      initState: {},
      initLocal: {
        count: 1000,
      },
      overrideStorage: localStorage,
    });

    expect(store.universe.local.count).toBe(10);
    const finalUniverse = await store.dispatch(deleteCount)();
    expect(finalUniverse.local.count).toBe(1000);

    expect(localStorage.getItem(serializeKey("count"))).toBe("1000");
  });

  it("deletes a local storage value without default", async () => {
    const localStorage = createInMemoryLocalStorage();
    localStorage.setItem(serializeKey("count"), JSON.stringify(10));

    const { store } = model.createStore({
      initState: {},
      overrideStorage: localStorage,
    });

    expect(store.universe.local.count).toBe(10);
    const finalUniverse = await store.dispatch(deleteCount)();
    expect(finalUniverse.local.count).toBe(undefined);

    expect(localStorage.getItem(serializeKey("count"))).toBeUndefined();
  });
});
