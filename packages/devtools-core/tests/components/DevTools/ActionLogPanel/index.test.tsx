import "@babel/polyfill";
import * as React from "react";
import {
  ActionLogPanel,
  emptyActionLogMessage,
} from "../../../../src/App/DevTools/ActionLogPanel";
import { model } from "../../../../src/model";
import { initState } from "../../../../src/store";
import { populatedState, renderWithProdo } from "../../../utils";

describe("ActionLogPanel", () => {
  it("is empty when there is no actions", async () => {
    const { getByTestId } = renderWithProdo(
      <ActionLogPanel />,
      model.createStore({ initState }),
    );

    expect(getByTestId("actionLogPanel").textContent).toBe(
      emptyActionLogMessage,
    );
  });

  it("renders all actions in the log", async () => {
    const { findAllByTestId } = renderWithProdo(
      <ActionLogPanel />,
      model.createStore({ initState: populatedState }),
    );

    expect(await findAllByTestId("actionLogRow")).toHaveLength(
      populatedState.app.actionLog.length,
    );
  });
});
