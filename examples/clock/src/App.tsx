import * as React from "react";
import { model, Time } from "./model";

const timer = (dateFn: () => Time) => {
  return {
    subscribe: (cb: (value: Time) => void) => {
      const interval = setInterval(() => {
        cb(dateFn());
      }, 100);

      return {
        unsubscribe: () => clearInterval(interval),
      };
    },
  };
};

export const setupStreams = model.action(({ streams }) => () => {
  streams.time = timer(() => {
    const date = new Date();
    return {
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
    };
  });
});

const timeToString = (n: number): string => {
  const s = n.toString();
  return s.length === 1 ? `0${n}` : s;
};

export default model.connect(
  ({ streams, watch, dispatch }) => () => {
    React.useEffect(() => {
      dispatch(setupStreams)();
    }, []);

    // FIXME: without the `||` this should not typecheck
    const { hours, minutes, seconds } = watch(streams.time) || {
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    return (
      <div className="clock">
        <span className="time hours">{timeToString(hours)}</span>
        {" : "}
        <span className="time minutes">{timeToString(minutes)}</span>
        {" : "}
        <span className="time seconds">{timeToString(seconds)}</span>
      </div>
    );
  },
  "App",
);
