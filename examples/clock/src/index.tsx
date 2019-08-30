// tslint:disable:no-console

import { ProdoProvider } from "@prodo/core";
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { initState, model } from "./model";

import "./index.scss";

const store = model.createStore({ initState });

ReactDOM.render(
  <ProdoProvider value={store}>
    <App />
  </ProdoProvider>,
  document.getElementById("root"),
);
