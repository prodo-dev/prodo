import * as React from "react";
import { StatePanel } from "../../../src/App/DevTools/StatePanel";
import { model } from "../../../src/model";
import { initState } from "../../../src/store";
import { populatedState } from "../../fixtures";
import { renderWithProdo } from "../../utils";

describe("StatePanel", () => {
  it("renders empty object with an empty state", async () => {
    const { getByTestId } = renderWithProdo(
      <StatePanel />,
      model.createStore({ initState }),
    );

    expect(getByTestId("statePanel").textContent.trim()).toBe(": {}");
  });

  it("renders the contents of a populated state", async () => {
    const { getByTestId } = renderWithProdo(
      <StatePanel />,
      model.createStore({ initState: populatedState }),
    );

    expect(
      getByTestId("statePanel")
        .textContent.trim()
        .includes("bar"),
    ).toBeTruthy;
  });
});
