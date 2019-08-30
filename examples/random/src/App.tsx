import * as React from "react";
import { model } from "./model";

export default model.connect(
  ({ random, watch, state }) => () => {
    return (
      <div className="random">
        <h1>Random: {random("test")}</h1>
        <h1>Count: {watch(state.count)}</h1>
      </div>
    );
  },
  "App",
);
