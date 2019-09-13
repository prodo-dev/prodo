import * as React from "react";
import { state, watch } from "../model";

export const StatePanel = () => (
  <div>
    {JSON.stringify(
      state ? watch(state.app.state) : "State: state is undefined",
    )}
  </div>
);
