import * as React from "react";
import App from "../../../src/App";
import render from "../../utils/render";
describe("render", () => {
  it("test1", async () => {
    const { container } = render(<App />, {
      initState: { todos: { T1: { text: "milk", done: false } } },
    });
    expect(container).toMatchSnapshot();
  });
});
