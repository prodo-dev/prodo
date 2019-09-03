import * as React from "react";
import { initialize } from "./actions";
import { dispatch, state, watch } from "./model";

export const App = () => {
  React.useEffect(() => {
    dispatch(initialize)();
  }, []);

  return (
    <div className="app">
      {watch(state.initialized) ? "Initialized" : "Not Initialized"}
    </div>
  );
};
