import { clearLogs } from "../../src/App/DevTools/components/ClearLogsButton";
import { model } from "../../src/model";
import { initState } from "../../src/store";
import { Action } from "../../src/types";
import { recordAction, recordUniverse } from "../../src/utils/communication";

import { populatedState, testActionLog, testAppState } from "../fixtures";

describe("actions", () => {
  it("records state", async () => {
    const { store } = model.createStore({
      initState,
    });

    const { state } = await store.dispatch(recordUniverse)(testAppState);
    expect(Object.keys(state.app.universe)).toHaveLength(
      Object.keys(testAppState).length,
    );

    const recordedState = state.app.universe;
    expect(recordedState).toEqual(testAppState);
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

  it("clears action and render logs", async () => {
    const { store } = model.createStore({
      initState: populatedState,
    });

    expect(store.universe.state.app.actionLog.length).toBeGreaterThan(0);
    const { state } = await store.dispatch(clearLogs)();
    expect(state.app.actionLog.length).toBe(0);
    expect(state.app.renderLog.length).toBe(0);
  });
});
