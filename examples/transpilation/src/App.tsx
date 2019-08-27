import * as React from "react";
import { initialize } from "./actions";
import { model } from "./model";

export default model.connect(
  ({ state, watch, dispatch }) => () => {
    React.useEffect(() => {
      dispatch(initialize)([]);
    }, []);

    return (
      <div className="app">
        {watch(state.initialized) ? "Initialized" : "Not Initialized"}
      </div>
    );
  },
  "App",
);
