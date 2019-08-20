import * as React from "react";
import { render } from "react-dom";
import { createStore } from "./store";
import { Store } from "./types";

export interface ProdoContextType {
  store: Store<any>;
}

export const ProdoContext = React.createContext<ProdoContextType>({
  store: (null as any) as Store<any>,
});

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
