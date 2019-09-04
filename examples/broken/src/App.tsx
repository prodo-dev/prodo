import * as React from "react";
import { model } from "./model";

const Cell = model.connect(({ state, watch }) => (props: { name: string }) => {
  const item = watch(state.grid[props.name]);
  const bg = item === undefined ? "white" : item === false ? "red" : "green";
  return <div style={{ backgroundColor: bg }}>{props.name}</div>;
});

const run = model.action(({ state }) => (values: string[]) => {
  values.forEach(name => {
    state.grid[name] = name[0] === name[0].toUpperCase();
  });
});

const RunButton = model.connect(
  ({ dispatch }) => (props: { names: string[] }) => (
    <button onClick={() => dispatch(run)(props.names)}>Run</button>
  ),
);

const names = ["a", "A", "b", "B"];
const App = () => (
  <div className="app">
    {names.map(name => (
      <Cell key={name} name={name} />
    ))}
    <RunButton names={names} />
  </div>
);

export default App;
