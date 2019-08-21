import { action } from "./store";

const timer = (interval: number) => ({
  subscribe: (cb: (value: number) => void) => {
    let count = 0;
    const inter = setInterval(() => {
      count += 1;

      cb(count);
    }, interval);

    return {
      unsubscribe: () => clearInterval(inter),
    };
  },
});

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
