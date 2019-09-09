import { ProdoProvider } from "@prodo/core";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import App from "./App";
import { model } from "./model";
import { initState } from "./store";

import "./index.scss";

const store = model.createStore({ initState });
ReactDOM.render(
  <ProdoProvider value={store}>
    <Router history={(window as any).myHistory}>
      <App />
    </Router>
  </ProdoProvider>,
  document.getElementById("root"),
);

window.store = store;
