import * as React from "react";
import { model } from "./model";

const timer = (dateFn: () => number) => {
  return {
    subscribe: (cb: (value: number) => void) => {
      const interval = setInterval(() => {
        cb(dateFn());
      }, 100);

      return {
        unsubscribe: () => clearInterval(interval),
      };
    },
  };
};

export const setupStreams = model.action(({ state, stream }) => () => {
  state.seconds = stream(timer)(() => new Date().getSeconds());
});

const timeToString = (n: number): string => {
  const s = n.toString();
  return s.length === 1 ? `0${n}` : s;
};

export default model.connect(
  ({ state, watch, dispatch }) => () => {
    React.useEffect(() => {
      dispatch(setupStreams)();
    }, []);

    return (
      <div className="clock">
        <span className="time hours">{timeToString(watch(state.hours))}</span>
        {" : "}
        <span className="time minutes">
          {timeToString(watch(state.minutes))}
        </span>
        {" : "}
        <span className="time seconds">
          {timeToString(watch(state.seconds))}
        </span>
      </div>
    );
  },
  "App",
);
