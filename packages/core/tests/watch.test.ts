import { createModel } from "../src";
import { Node, Store } from "../src/types";
import { joinPath } from "../src/utils";
import * as watch from "../src/watch";

interface State {
  [key: string]: {
    [key: string]: {
      [key: string]: number;
    };
  };
}

const initState: State = {
  a: {
    aa: {
      aaa: 0,
    },
    ab: {
      aba: 1,
      abb: 2,
    },
    ac: {
      aca: 3,
      acb: 4,
      acc: 5,
    },
  },
  b: {
    ba: {},
  },
  c: {},
};

const model = createModel<State>();

const createNode = (name: string, compId: number, pathKey: string): Node => ({
  name,
  compId,
  pathKey,
  setState: () => {}, // tslint:disable-line:no-empty
  status: { unmounted: false },
});

const subscribe = (
  store: Store<any, any>,
  compId: number,
  path: string[],
): Node => {
  const node = createNode("", compId, joinPath(path));
  watch.subscribe(store, path, node);

  return node;
};

describe("subscribe", () => {
  it("should subscribe to root of state", () => {
    const { store } = model.createStore({ initState });

    subscribe(store, 0, []);

    expect(store.watchTree.subs.size).toBe(1);
    expect(store.watchTree.esubs.size).toBe(1);
  });

  it("should subscribe to single leaf of the state", () => {
    const { store } = model.createStore({ initState });

    const node = subscribe(store, 0, ["a", "aa", "aaa"]);

    expect(store.watchTree.subs.size).toBe(1);
    expect(store.watchTree.esubs.size).toBe(0);

    expect(store.watchTree.children.a.subs.size).toBe(1);
    expect(store.watchTree.children.a.esubs.size).toBe(0);

    expect(store.watchTree.children.a.children.aa.subs.size).toBe(1);
    expect(store.watchTree.children.a.children.aa.esubs.size).toBe(0);

    expect(store.watchTree.children.a.children.aa.children.aaa.subs.size).toBe(
      1,
    );
    expect(store.watchTree.children.a.children.aa.children.aaa.esubs.size).toBe(
      1,
    );

    const subNode = Array.from(
      store.watchTree.children.a.children.aa.children.aaa.esubs,
    )[0];
    expect(node).toBe(subNode);
  });
});

describe("unsubscribe", () => {
  it("should unsubscribe and not prune tree when subscriptions remaining", () => {
    const { store } = model.createStore({ initState });

    const path = ["a"];
    const node = subscribe(store, 0, path);
    subscribe(store, 1, ["a", "aa"]);

    expect(store.watchTree.subs.size).toBe(2);
    expect(store.watchTree.children.a.subs.size).toBe(2);
    expect(store.watchTree.children.a.children.aa.subs.size).toBe(1);

    watch.unsubscribe(store, path, node);

    expect(store.watchTree.subs.size).toBe(1);
    expect(store.watchTree.children.a.subs.size).toBe(1);
    expect(store.watchTree.children.a.children.aa.subs.size).toBe(1);
    expect(Object.keys(store.watchTree.children)).toHaveLength(1);
  });

  it("should unsubscribe and prune tree when no subscriptions remaining", () => {
    const { store } = model.createStore({ initState });

    const path = ["a", "aa"];
    const node = subscribe(store, 0, path);

    expect(store.watchTree.subs.size).toBe(1);
    expect(store.watchTree.children.a.subs.size).toBe(1);
    expect(store.watchTree.children.a.children.aa.subs.size).toBe(1);

    watch.unsubscribe(store, path, node);

    expect(store.watchTree.subs.size).toBe(0);
    expect(Object.keys(store.watchTree.children)).toHaveLength(0);
  });
});
