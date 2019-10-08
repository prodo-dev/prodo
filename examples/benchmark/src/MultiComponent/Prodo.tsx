import { createModel } from "@prodo/core";
import * as React from "react";
import Controls from "./Controls";
import { shuffle } from "./lib";
import { State } from "./types";

const model = createModel<State>();

const changeN = model.action(
  ({ state, dispatch }) => async (fraction: number, count: number) => {
    const idxs = [...Array(state.length)].map((_, i) => i);
    shuffle(idxs);

    idxs.slice(Math.floor(fraction * state.length)).forEach(idx => {
      state[idx].value = !state[idx].value;
    });
    if (count > 1) {
      dispatch(changeN)(fraction, count - 1);
    }
    await new Promise(res => setTimeout(res, 0));
  },
);

const changeNSync = model.action(
  ({ state, dispatch }) => (fraction: number, count: number) => {
    const idxs = [...Array(state.length)].map((_, i) => i);
    shuffle(idxs);

    idxs.slice(Math.floor(fraction * state.length)).forEach(idx => {
      state[idx].value = !state[idx].value;
    });
    if (count > 1) {
      dispatch(changeNSync)(fraction, count - 1);
    }
  },
);

const Box = model.connect(({ watch, state }) => ({ idx }: { idx: number }) => {
  const value = watch(state[idx].value);
  return <div className={`box ${value ? "on" : "off"}`} />;
});

const Grid = model.connect(({ watch, state }) => () => {
  const n = watch(state.length);
  return (
    <div>
      {[...Array(n)].map((_, i) => (
        <Box key={i} idx={i} />
      ))}
    </div>
  );
});

const ProdoApp = model.connect(({ dispatch }) => () => (
  <div>
    <Controls changeN={dispatch(changeN)} changeNSync={dispatch(changeNSync)} />
    <Grid />
  </div>
));

const { Provider } = model.createStore({
  initState: [...Array(300)].map(() => ({
    value: false,
  })),
});

export default () => (
  <Provider>
    <ProdoApp />
  </Provider>
);
