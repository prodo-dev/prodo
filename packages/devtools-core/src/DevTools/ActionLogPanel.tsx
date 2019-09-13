import * as React from "react";
import { state, watch } from "../model";

export const ActionLogPanel = () => (
  <div>
    {JSON.stringify(
      state ? watch(state.app.actionLog) : "Action Log: state is undefined",
    )}
  </div>
);
