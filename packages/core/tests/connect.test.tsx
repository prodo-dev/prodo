import { fireEvent } from "@testing-library/react";
import * as React from "react";
import prodo, { createTestRenderer } from "../src";

interface State {
  foo: string;
}

const state: State = {
  foo: "foo",
};

const { action, connect } = prodo<State>();

const renderWithProdo = createTestRenderer<State>();

const changeFoo = action("changeFoo", () => ({ state }) => {
  state.foo = "bar";
});

const App = connect(
  "App",
  ({ state, watch, dispatch }) => () => (
    <div>
      <button data-testid="button" onClick={() => dispatch(changeFoo)({})} />
      {watch(state.foo)}
    </div>
  ),
);

describe("connect", () => {
  it("connects app to store", async () => {
    const { container } = renderWithProdo(<App />, { state });

    expect(container.textContent).toBe("foo");
  });

  it("changes what is rendered after", async () => {
    const { container, getByTestId } = renderWithProdo(<App />, { state });

    expect(container.textContent).toBe("foo");
    await fireEvent.click(getByTestId("button"));
    expect(container.textContent).toBe("bar");
  });
});
