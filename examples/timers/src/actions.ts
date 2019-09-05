import * as rx from "rxjs";
import { model } from "./store";

const numTimers = 20;

export const setupStreams = model.action(
  ({ streams }) => () => {
    for (let i = 1; i <= numTimers; i += 1) {
      const interval = i * 100;
      const name = `${(1000 / interval).toFixed(2)} Hz`;
      streams[name] = rx.interval(interval);
    }
  },
  "setupCounters",
);
