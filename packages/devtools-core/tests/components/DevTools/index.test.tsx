import "@babel/polyfill";
import * as React from "react";
import { DevTools } from "../../../src/App/DevTools";
import { model } from "../../../src/model";
import { initState } from "../../../src/store";
import { renderWithProdo } from "../../utils";

describe("DevTools", () => {
  it("can render with initial store", async () => {
    const { getByTestId } = renderWithProdo(
      <DevTools />,
      model.createStore({ initState }),
    );

    expect(getByTestId("headerTabState").textContent).toBe("State");
    expect(getByTestId("headerTabActionLog").textContent).toBe("Action Log");
  });
});
