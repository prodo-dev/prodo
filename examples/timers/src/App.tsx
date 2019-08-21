import * as React from "react";
import { connect } from "./store";

const Counter = connect(
  "Counter",
  ({ state, watch }) => ({ id }: { id: string }) => {
    const counter = watch(state.counters[id]);

    return (
      <div className="counter">
        <h1 className="name">{counter.name}</h1>
        <h2 className="value">{counter.value}</h2>
      </div>
    );
  },
);

const App = connect(
  "App",
  ({ state, watch }) => () => {
    return (
      <div className="app">
        {Object.keys(watch(state.counters)).map(id => (
          <Counter key={id} id={id} />
        ))}
      </div>
    );
  },
);

export default App;
