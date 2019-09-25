import { fireEvent } from "@testing-library/react";
import * as React from "react";
import { ActionLogRow } from "../../../../src/App/DevTools/ActionLogPanel/ActionLogRow";
import { model } from "../../../../src/model";
import { populatedState } from "../../../fixtures";
import { renderWithProdo } from "../../../utils";

describe("ActionLogRow", () => {
  it("shows the action name in the header", async () => {
    const action = populatedState.app.actionLog[0];
    const { getByTestId } = renderWithProdo(
      <ActionLogRow action={action} />,
      model.createStore({ initState: populatedState }),
    );

    expect(
      getByTestId("actionLogRowHeader").textContent.includes(action.actionName),
    ).toBeTruthy;
  });

  it("toggles the action contents when action name clicked", async () => {
    const action = populatedState.app.actionLog[0];
    const { getByTestId } = renderWithProdo(
      <ActionLogRow action={action} />,
      model.createStore({ initState: populatedState }),
    );

    const title = action.actionName;
    expect(getByTestId("actionLogRowContents")).toThrowError;
    fireEvent.click(getByTestId("actionLogRowHeader"));
    expect(getByTestId("actionLogRowContents")).toBeTruthy;
    fireEvent.click(getByTestId("actionLogRowHeader"));
    expect(getByTestId("actionLogRowContents")).toThrowError;
  });
});
