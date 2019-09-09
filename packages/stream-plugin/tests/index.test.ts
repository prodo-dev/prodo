import { createModel } from "@prodo/core";
import streamPlugin, { Stream } from "../src";

interface Streams {
  count?: Stream<number>;
}

const model = createModel<{}>().with(streamPlugin<Streams>());

let activeStreams = 0;

const counter = (interval: number, track: Boolean = false): Stream<number> => ({
  subscribe: cb => {
    let i = 0;
    if (track) activeStreams++;
    const id = setInterval(() => {
      cb(i++);
    }, interval);
    return {
      unsubscribe: () => {
        if (track) activeStreams--;
        clearInterval(id);
      },
    };
  },
});

const startCounter = model.action(
  ({ streams }) => (interval: number, track: Boolean = false) => {
    streams.count = counter(interval, track);
  },
);

const stopCounter = model.action(({ streams }) => () => {
  delete streams.count;
});

describe("stream plugin", () => {
  it("updates a counter", async () => {
    const store = model.createStore({
      initState: {},
    });

    await store.dispatch(startCounter)(10);
    await new Promise(res => setTimeout(() => res(), 30));
    expect(store.universe.streams.count).toBeLessThan(5);
    await new Promise(res => setTimeout(() => res(), 100));
    expect(store.universe.streams.count).toBeGreaterThan(5);
  });

  it("unsubscribes", async () => {
    const store = model.createStore({
      initState: {},
    });

    await store.dispatch(startCounter)(10, true);
    expect(activeStreams).toBeGreaterThan(0);
    await store.dispatch(stopCounter)();
    expect(activeStreams).toEqual(0);
  });
});
