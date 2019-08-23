/* import * as React from "react";
 * import { render } from "react-dom";
 * import { ProdoContext } from "./context";
 * import { createStore } from "./store";
 * import { Dispatch } from "./types";
 *
 * export const prodoRender = <S extends {}>({
 *   initialState,
 * }: {
 *   initialState: S;
 * }) => (
 *   element: React.ReactElement,
 *   container: Element | null,
 * ): { dispatch: Dispatch } => {
 *   const store = createStore(initialState);
 *
 *   const dispatch: Dispatch = func => args => {
 *     func(args)(store);
 *   };
 *
 *   render(
 *     <ProdoContext.Provider value={{ store }}>{element}</ProdoContext.Provider>,
 *     container,
 *   );
 *
 *   return { dispatch };
 * }; */
