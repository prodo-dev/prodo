import "@babel/polyfill";
import * as React from "react";
import { ActionLogRow } from "../../../../src/App/DevTools/ActionLogPanel/ActionLogRow";
import { model } from "../../../../src/model";
import { populatedState, renderWithProdo } from "../../../utils";

describe("ActionLogRow", () => {
  it("shows the action name in the header", async () => {
    const action = populatedState.app.actionLog[0];
    const { getByTestId } = renderWithProdo(
      <ActionLogRow action={action} />,
      model.createStore({ initState: populatedState }),
    );

    expect(getByTestId("actionLogRowHeader").textContent).toBe(
      action.actionName,
    );
  });
});
