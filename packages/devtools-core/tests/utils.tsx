import "@babel/polyfill";
import { Store } from "@prodo/core";
import { Provider } from "@prodo/core/src";
import { render } from "@testing-library/react";
import * as React from "react";
import { ThemeProvider } from "styled-components";
import darkTheme from "../src/styles/theme";

export const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={darkTheme}>{ui}</ThemeProvider>);
};

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
