import * as React from "react";
import { model } from "./store";

const Counter = model.connect(
  ({ streams, watch }) => ({ id }: { id: string }) => {
    const counter = watch(streams[id]);

    return (
      <div className="counter">
        <h1 className="name">{id}</h1>
        <h1 className="value">{counter}</h1>
      </div>
    );
  },
  "Counter",
);

const App = model.connect(
  ({ streams, watch }) => () => {
    return (
      <div className="app">
        {Object.keys(watch(streams)).map(id => (
          <Counter key={id} id={id} />
        ))}
      </div>
    );
  },
  "App",
);

export default App;
