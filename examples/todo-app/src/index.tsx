import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { initState, model } from "./store";
import { Provider } from "@prodo/core";

import "./index.scss";

const store = model.createStore({ initState });
ReactDOM.render(
  <Provider value={store}>
    <App />
  </Provider>,
  document.getElementById("root"),
);
