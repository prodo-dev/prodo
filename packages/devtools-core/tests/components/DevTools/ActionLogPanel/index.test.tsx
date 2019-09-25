import * as React from "react";
import {
  ActionLogPanel,
  emptyActionLogMessage,
} from "../../../../src/App/DevTools/ActionLogPanel";
import { model } from "../../../../src/model";
import { initState } from "../../../../src/store";
import { populatedState } from "../../../fixtures";
import { renderWithProdo } from "../../../utils";

describe("ActionLogPanel", () => {
  it("is empty when there is no actions", async () => {
    const { getByTestId, queryByTestId } = renderWithProdo(
      <ActionLogPanel />,
      model.createStore({ initState }),
    );

    expect(getByTestId("actionLogPanel").textContent).toBe(
      emptyActionLogMessage,
    );

    expect(queryByTestId("clearLogsButton")).toBeNull();
  });

  it("renders all actions in the log", async () => {
    const { findAllByTestId, getByTestId } = renderWithProdo(
      <ActionLogPanel />,
      model.createStore({ initState: populatedState }),
    );

    expect(await findAllByTestId("actionLogRow")).toHaveLength(
      populatedState.app.actionLog.length,
    );

    expect(getByTestId("clearLogsButton")).toBeTruthy;
  });
});
