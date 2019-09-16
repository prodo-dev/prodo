import { DevTools } from "@prodo/devtools-plugin";
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { model } from "./model";
import { initState } from "./store";

import "./index.scss";

import "@babel/polyfill";

const { Provider } = model.createStore({ initState });
ReactDOM.render(
  <DevTools>
    <Provider>
      <App />
    </Provider>
  </DevTools>,
  document.getElementById("root"),
);
