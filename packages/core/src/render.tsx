import * as React from "react";
import { render } from "react-dom";
import { ProdoContext } from "./context";
import { createStore } from "./store";

export const prodoRender = <S extends {}>({
  initialState,
}: {
  initialState: S;
}) => (element: React.ReactElement, container: Element | null) => {
  const store = createStore(initialState);

  return render(
    <ProdoContext.Provider value={{ store }}>{element}</ProdoContext.Provider>,
    container,
  );
};
