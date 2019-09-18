import { model } from "../../src/model";
import { Action } from "../../src/types";
import { recordAction, recordState } from "../../src/utils/communication";

import "@babel/polyfill";

describe("actions", () => {
  it("records state", async () => {
    const { store } = model.createStore({
      initState: { app: { state: {}, actionLog: [] }, ui: { iframe: null } },
    });

    const newState = { foo: "bar", items: [1, 2], test: { a: "b" } };
    const { state } = await store.dispatch(recordState)(newState);
    expect(Object.keys(state.app.state)).toHaveLength(
      Object.keys(newState).length,
    );

    const recordedState = state.app.state;
    expect(recordedState.foo).toBe("bar");
    expect(recordedState.items[0]).toBe(1);
    expect(recordedState.test.a).toBe("b");
  });

  it("records an action", async () => {
    const { store } = model.createStore({
      initState: { app: { state: {}, actionLog: [] }, ui: { iframe: null } },
    });

    const action: Action = {
      actionName: "actionName",
      id: "id",
      parentId: null,
      prevUniverse: { state: {} },
      nextActions: [],
      args: {},
      patches: [],
    };
    const { state } = await store.dispatch(recordAction)(action);
    expect(state.app.actionLog.length).toBe(1);
    expect(state.app.actionLog[0].actionName).toBe("actionName");
  });
});
