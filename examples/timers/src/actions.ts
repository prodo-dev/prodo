import * as rx from "rxjs";
import { model } from "./store";

const numTimers = 20;
const mult = 100;

export const setupCounter = model.action(
  () => (i: number) => {
  //({ state, streams }) => (i: number) => {
    rx.interval(i * mult);
  },
  "setupCounter",
);

export const setupStreams = model.action(
  ({ state, dispatch }) => () => {
    for (let i = 1; i <= numTimers; i += 1) {
      state.counters[i.toString()] = {
        name: `${(1000 / (i * mult)).toFixed(2)} mHz`,
        value: 0,
      };

      dispatch(setupCounter)(i);
    }
  },
  "setupStreams",
);
