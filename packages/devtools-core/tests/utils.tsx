import "@babel/polyfill";
import { Store } from "@prodo/core";
import { Provider } from "@prodo/core/src";
import { render } from "@testing-library/react";
import * as React from "react";
import { ThemeProvider } from "styled-components";
import { State } from "../src/model";
import darkTheme from "../src/styles/theme";

export const renderWithProdo = (
  ui: React.ReactElement,
  context: { store: Store<any, any>; Provider: Provider },
) => {
  return {
    ...render(
      <context.Provider>
        <ThemeProvider theme={darkTheme}>{ui}</ThemeProvider>
      </context.Provider>,
    ),
    store: context.store,
  };
};

export const testAppState = { foo: "bar", items: [1, 2], test: { a: "b" } };
export const testActionLog = [
  {
    actionName: "actionName1",
    id: "id1",
    parentId: null,
    prevUniverse: { state: {} },
    nextActions: [],
    args: {},
    patches: [],
  },
  {
    actionName: "actionName2",
    id: "id2",
    parentId: null,
    prevUniverse: { state: {} },
    nextActions: [],
    args: {},
    patches: [],
  },
  {
    actionName: "actionName3",
    id: "id3",
    parentId: null,
    prevUniverse: { state: {} },
    nextActions: [],
    args: {},
    patches: [],
  },
];

export const populatedState: State = {
  app: { state: testAppState, actionLog: testActionLog },
  ui: { iframe: null },
};
