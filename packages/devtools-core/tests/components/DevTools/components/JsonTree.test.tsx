import "@babel/polyfill";
import * as React from "react";
import JsonTree from "../../../../src/App/DevTools/components/JsonTree";
import { model } from "../../../../src/model";
import { initState } from "../../../../src/store";
import { renderWithProdo } from "../../../utils";

describe("JsonTree", () => {
  it("renders the value", async () => {
    const value = { foo: "bar" };
    const { getByTestId } = renderWithProdo(
      <JsonTree value={value} />,
      model.createStore({ initState }),
    );

    expect(getByTestId("jsonTree").textContent.trim()).toBe(': {foo : "bar"}');
  });
});
