import { action } from "./store";
import * as rx from "rxjs";

const timer = (interval: number) => {
  return rx.interval(interval);
};

const numTimers = 20;
const mult = 100;

export const setupCounter = action(
  "setupCounter",
  (i: number) => ({ state, stream }) => {
    state.counters[i.toString()].value = stream(timer)(i * mult);
  },
);

export const setupStreams = action(
  "setupStream",
  () => ({ state, dispatch }) => {
    for (let i = 1; i <= numTimers; i += 1) {
      state.counters[i.toString()] = {
        name: `${(1000 / (i * mult)).toFixed(2)} mHz`,
        value: 0,
      };

      dispatch(setupCounter)(i);
    }
  },
);
