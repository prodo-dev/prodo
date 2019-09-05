import { ProdoProvider } from "@prodo/core";
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { Local, model } from "./model";

import "./index.scss";

export const initLocal: Local = {
  center: [51.507351, -0.127758],
  zoom: 12,
};

const store = model.createStore({ initState: {}, initLocal });

ReactDOM.render(
  <ProdoProvider value={store}>
    <App />
  </ProdoProvider>,
  document.getElementById("root"),
);

(window as any).store = store;
