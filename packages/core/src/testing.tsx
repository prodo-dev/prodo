import { render } from "@testing-library/react";
import * as React from "react";
import { ProdoContext } from "./context";
import { createStore } from "./store";
import { Action } from "./types";

export const createTestRenderer = <S extends {}>() => (
  ui: React.ReactElement,
  { state }: { state: S },
) => {
  const store = createStore(state);
  return render(
    <ProdoContext.Provider value={{ store }}>{ui}</ProdoContext.Provider>,
  );
};

type TestDispatch<S> = <T>(func: Action<T>) => (args: T) => Promise<S>;

export const createTestDispatch = <S extends {}>() => ({
  state,
}: {
  state: S;
}) => {
  const store = createStore(state);

  const dispatch: TestDispatch<S> = func => async args => {
    const actionsCompleted = new Promise(async r => {
      store.watchForComplete = {
        count: 0,
        cb: r,
      };
    });

    await func(args)(store);
    await actionsCompleted;
    store.watchForComplete = undefined;

    return store.state;
  };

  return { dispatch, state };
};
