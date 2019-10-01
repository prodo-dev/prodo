import * as React from "react";
import App from "../../src/App";
import { model } from "../../src/model";
import { initState } from "../../src/store";
import { renderWithProdo } from "../utils";

describe("App", () => {
  it("can render with initial store", async () => {
    const { getByTestId } = renderWithProdo(
      <App />,
      model.createStore({ initState }),
    );

    expect(getByTestId("devToolsApp")).toBeTruthy;
    expect(getByTestId("devTools")).toBeTruthy;
    expect(getByTestId("userAppContainer")).toBeTruthy;
  });
});
