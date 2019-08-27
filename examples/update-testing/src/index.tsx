// tslint:disable:no-console

import { ProdoProvider } from "@prodo/core";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { initState, model, numItems } from "./store";

import "./index.scss";

export const updateItem = model.action(
  ({ state }) => ({ id, value }: { id: string; value: boolean }) => {
    state.items[id] = value;
  },
);

const Value = (props: { name: string; value: string }) => (
  <div
    style={{
      display: "inline-block",
      margin: "0 1rem",
    }}
  >
    <span
      style={{
        display: "inline-block",
        fontWeight: "bold",
        paddingRight: "0.5rem",
      }}
    >
      {props.name}
    </span>
    <span
      style={{
        color: "hotpink",
        fontWeight: "bold",
      }}
    >
      {props.value}
    </span>
  </div>
);

const Item = model.connect(
  ({ state, dispatch, watch }) => ({
    id,
    delay,
  }: {
    id: string;
    delay: number;
  }) => {
    const [mountVal] = React.useState(Math.random());
    const [stateOn, setOn] = React.useState(false);
    const watchOn = watch(state.items[id]);

    React.useEffect(() => {
      console.log("creating effect", delay, stateOn);

      setTimeout(() => {
        console.log(`setting item ${id} to ${!stateOn}`);
        const newValue = !stateOn;
        setOn(newValue);
        dispatch(updateItem)({ id, value: newValue });
      }, delay);
    }, []);

    return (
      <div
        style={{
          padding: "1rem",
          margin: "0.5rem 0",
          borderRadius: "2px",
          border: "solid 2px #333",
          borderColor: stateOn ? "orange" : "black",
          backgroundColor: watchOn ? "peachpuff" : "white",
        }}
      >
        <Value name="delay" value={Math.round(delay).toString() + "ms"} />
        <Value name="useState" value={stateOn.toString()} />
        <Value name="watchState" value={watchOn.toString()} />
        <Value name="mount val" value={mountVal.toFixed(4).toString()} />
      </div>
    );
  },
);

const App = () => (
  <div>
    <h2>Component Update Testing</h2>
    <p>
      useState and watchState should be the same value. <br /> mount val is a
      random number created once in useState. It should not change.
    </p>
    {new Array(numItems).fill(0).map((_, i) => (
      <Item key={i} id={i.toString()} delay={Math.random() * 1000 + 1000} />
    ))}
  </div>
);

const store = model.createStore({ initState });

ReactDOM.render(
  <ProdoProvider value={store}>
    <App />
  </ProdoProvider>,
  document.getElementById("root"),
);
