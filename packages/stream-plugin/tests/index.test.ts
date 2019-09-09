import { createModel } from "@prodo/core";
import streamPlugin, { Stream } from "../src";

interface Streams {
  count?: Stream<number>;
}

const model = createModel<{}>().with(streamPlugin<Streams>());

const counter = (interval: number): Stream<number> => ({
  subscribe: cb => {
    let i = 0;
    const id = setInterval(() => {
      cb(i++);
    }, interval);
    return {
      unsubscribe: () => {
        clearInterval(id);
      },
    };
  },
});

const startCounter = model.action(({ streams }) => (interval: number) => {
  streams.count = counter(interval);
});

describe("stream plugin", () => {
  it("updates a counter", async () => {
    const { store } = model.createStore({
      initState: {},
    });

    await store.dispatch(startCounter)(10);
    await new Promise(res => setTimeout(() => res(), 30));
    expect(store.universe.streams.count).toBeLessThan(5);
    await new Promise(res => setTimeout(() => res(), 100));
    expect(store.universe.streams.count).toBeGreaterThan(5);
  });
});
