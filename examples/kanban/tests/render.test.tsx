import "@babel/polyfill";
import { fireEvent, render, waitForDomChange } from "@testing-library/react";
import { createMemoryHistory } from "history";
import * as React from "react";
import App from "../src/components/App";
import { model } from "../src/model";
import { initState } from "./fixtures";

describe("components", () => {
  it("can render with initial store", async () => {
    const { Provider, store } = model.createStore({
      initState,
      route: { history: createMemoryHistory() },
      logger: false,
    });
    render(
      <Provider>
        <App />
      </Provider>,
    );
  });

  it("can open a board", async () => {
    const { Provider, store } = model.createStore({
      initState,
      route: { history: createMemoryHistory() },
      logger: false,
    });

    const { container, getByTestId } = render(
      <Provider>
        <App />
      </Provider>,
    );

    const button = getByTestId("button-todos");
    fireEvent.click(button);
    expect(store.universe.route.path).toBe("/b/B1/todos");
  });
});
