import { createModel } from "@prodo/core";
import * as React from "react";
import { State, newState, toggle } from "./types";
import Controls from "../Controls";

const model = createModel<State>();
const n = 300;

const changeN = model.action(
  ({ state, dispatch }) => async (fraction: number, count: number) => {
    toggle(state, fraction);
    if (count > 1) {
      dispatch(changeN)(fraction, count - 1);
    }
    await new Promise(res => setTimeout(res, 0));
  },
);

const changeNSync = model.action(
  ({ state, dispatch }) => (fraction: number, count: number) => {
    toggle(state, fraction);
    if (count > 1) {
      dispatch(changeNSync)(fraction, count - 1);
    }
  },
);

const Box = model.connect(({ watch, state }) => ({ idx }: { idx: number }) => {
  let i = 0;
  while (i++ < idx && state.next) {
    state = state.next;
  }

  const value = watch(state.value);
  return <div className={`box ${value ? "on" : "off"}`} />;
});

const Grid = model.connect(({}) => () => (
  <div>
    {[...Array(n)].map((_, i) => (
      <Box key={i} idx={i} />
    ))}
  </div>
));

const App = model.connect(({ dispatch }) => () => (
  <div>
    <Controls changeN={dispatch(changeN)} changeNSync={dispatch(changeNSync)} />
    <Grid />
  </div>
));

const { Provider } = model.createStore({ initState: newState(n) });

export default () => (
  <Provider>
    <App />
  </Provider>
);
