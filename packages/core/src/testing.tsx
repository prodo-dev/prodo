import { render } from "@testing-library/react";
import * as React from "react";
import { ProdoContext } from "./context";
import { createStore } from "./store";

export const createTestRenderer = <S extends {}>() => (
  ui: React.ReactElement,
  { state }: { state: S },
) => {
  const store = createStore(state);
  return render(
    <ProdoContext.Provider value={{ store }}>{ui}</ProdoContext.Provider>,
  );
};

/* export const createTestDispatch = <S extends {}>() => ({ */
/* state, */
/* }: { */
/* state: S; */
/* }): Promise<S> => { */
/* const store = createStore(state); */
/* }; */
