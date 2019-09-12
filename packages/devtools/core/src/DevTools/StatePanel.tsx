import * as React from "react";
import { state, watch } from "../model";

export const StatePanel = () => (
  <div>
    State panel contents
    <div>{Object.keys(watch(state.app.state))}</div>
  </div>
);

export default StatePanel;
