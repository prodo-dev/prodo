import * as React from "react";
import { model } from "./store";

const Counter = model.connect(
  ({ state, watch }) => ({ id }: { id: string }) => {
    const counter = watch(state.counters[id]);

    return (
      <div className="counter">
        <h1 className="name">{counter.name}</h1>
        <h1 className="value">{counter.value}</h1>
      </div>
    );
  },
  "Counter",
);

const App = model.connect(
  ({ state, watch }) => () => {
    return (
      <div className="app">
        {Object.keys(watch(state.counters)).map(id => (
          <Counter key={id} id={id} />
        ))}
      </div>
    );
  },
  "App",
);

export default App;
