import { model } from "../../src/model";
import { initState } from "../../src/store";
import { Action } from "../../src/types";
import { recordAction, recordState } from "../../src/utils/communication";

import "@babel/polyfill";
import { testActionLog, testAppState } from "../utils";

describe("actions", () => {
  it("records state", async () => {
    const { store } = model.createStore({
      initState,
    });

    const { state } = await store.dispatch(recordState)(testAppState);
    expect(Object.keys(state.app.state)).toHaveLength(
      Object.keys(testAppState).length,
    );

    const recordedState = state.app.state;
    expect(recordedState.foo).toBe("bar");
    expect(recordedState.items[0]).toBe(1);
    expect(recordedState.test.a).toBe("b");
  });

  it("records an action", async () => {
    const { store } = model.createStore({
      initState,
    });

    const action: Action = testActionLog[0];
    const { state } = await store.dispatch(recordAction)(action);
    expect(state.app.actionLog.length).toBe(1);
    expect(state.app.actionLog[0].actionName).toBe(testActionLog[0].actionName);
  });
});
