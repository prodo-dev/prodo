import "@babel/polyfill";
import { Store } from "@prodo/core";
import { Provider } from "@prodo/core/src";
import { render } from "@testing-library/react";
import * as React from "react";
import App, { moveMap } from "../src/App";
import { model, Local } from "../src/model";

const initLocal: Local = {
  center: [51.507351, -0.127758],
  zoom: 12,
};

const renderWithProdo = (
  ui: React.ReactElement,
  context: { store: Store<any, any>; Provider: Provider },
) => {
  return {
    ...render(<context.Provider>{ui}</context.Provider>),
    store: context.store,
  };
};

test("can render my app without crashing", async () => {
  renderWithProdo(
    <App />,
    model.createStore({ initState: {}, initLocal, mockLocal: true }),
  );
});

test("can move map", async () => {
  const { store } = model.createStore({
    initState: {},
    initLocal,
    mockLocal: true,
  });

  const { local } = await store.dispatch(moveMap)([100, 100], 1);
  expect(local).toEqual({
    center: [100, 100],
    zoom: 1,
  });
});
