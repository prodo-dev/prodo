import * as React from "react";
import * as ReactDOM from "react-dom";
import { DevToolsApp } from "./App";
import { model } from "./model";
import { initState } from "./store";

import "./styles.css";

export default DevToolsApp;

const { Provider } = model.createStore({ initState });

ReactDOM.render(
  <Provider>
    <DevToolsApp />
  </Provider>,
  document.getElementById("root"),
);
