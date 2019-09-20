import "@babel/polyfill";
import * as React from "react";
import JsonTree from "../../../../src/App/DevTools/components/JsonTree";
import { renderWithTheme } from "../../../utils";

describe("JsonTree", () => {
  it("renders the value", async () => {
    const value = { foo: "bar" };
    const { getByTestId } = renderWithTheme(<JsonTree value={value} />);

    expect(getByTestId("jsonTree").textContent.trim()).toBe(': {foo : "bar"}');
  });
});
