import * as React from "react";
import { state, watch } from "../model";

export const StatePanel = () => (
  <div>
    <div>Just initial state for now:</div>
    {JSON.stringify(
      state ? watch(state.app.state) : "State: state is undefined",
    )}
  </div>
);
