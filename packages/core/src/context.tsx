import * as React from "react";
import { render } from "react-dom";
import { ReactElement } from "react";
import { Store } from "./types";
import { createStore } from "./store";

export type ProdoContextType = {
  store: Store<any>;
};

export const ProdoContext = React.createContext<ProdoContextType>({
  store: (null as any) as Store<any>,
});

export const prodoRender = <S extends {}>({
  initialState,
}: {
  initialState: S;
}) => (element: ReactElement, container: Element | null) => {
  const store = createStore(initialState);

  return render(
    <ProdoContext.Provider value={{ store }}>{element}</ProdoContext.Provider>,
    container,
  );
};
