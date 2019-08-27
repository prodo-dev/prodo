import { fireEvent, render } from "@testing-library/react";
import * as React from "react";
import { createModel, Provider } from "../src";

interface State {
  foo: string;
}

const initState: State = {
  foo: "foo",
};

const model = createModel<State>();

const changeFoo = model.action(({ state }) => () => {
  state.foo = "bar";
});

const App = model.connect(({ state, watch, dispatch }) => () => (
  <div data-testid="app">
    <button data-testid="button" onClick={() => dispatch(changeFoo)({})} />
    {watch(state.foo)}
  </div>
));

const renderWithProdo = (ui: React.ReactElement, initState: State) => {
  const store = model.createStore({ initState });
  return {
    ...render(<Provider value={store}>{ui}</Provider>),
    store,
  };
};

describe("connect", () => {
  it("connects app to store", async () => {
    const { container } = renderWithProdo(<App />, initState);

    expect(container.textContent).toBe("foo");
  });

  it("changes what is rendered after", async () => {
    const { getByTestId } = renderWithProdo(<App />, initState);

    expect(getByTestId("app").textContent).toBe("foo");
    await fireEvent.click(getByTestId("button"));
    await new Promise(r => setTimeout(r, 0));
    expect(await getByTestId("app").textContent).toBe("bar");
  });
});
