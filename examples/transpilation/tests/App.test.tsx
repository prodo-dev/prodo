import { ProdoProvider, Store } from "@prodo/core";
import { render, waitForDomChange } from "@testing-library/react";
import * as React from "react";
import { App } from "../src/App";
import { initState, model } from "../src/model";

import "@babel/polyfill";

const renderWithProdo = (ui: React.ReactElement, store: Store<any, any>) => {
  return {
    ...render(<ProdoProvider value={store}>{ui}</ProdoProvider>),
    store,
  };
};

describe("App", () => {
  it("can render with initial store", async () => {
    const { container } = await renderWithProdo(
      <App />,
      model.createStore({ initState }),
    );

    await waitForDomChange({ container });

    expect(container.textContent).toBe("Initialized");
  });
});
