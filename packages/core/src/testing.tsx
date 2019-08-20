import * as React from "react";
import { render } from "@testing-library/react";
import { ProdoContext } from "./context";
import { createStore } from "./store";

export const createTestRenderer = <S extends {}>() => (
  ui: React.ReactElement,
  { initialState }: { initialState: S },
) => {
  const store = createStore(initialState);
  return render(
    <ProdoContext.Provider value={{ store }}>{ui}</ProdoContext.Provider>,
  );
};
