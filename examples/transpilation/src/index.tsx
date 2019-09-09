// tslint:disable:no-console

import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./App";
import { initState, model } from "./model";

import "./index.scss";

const { Provider } = model.createStore({ initState });

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById("root"),
);
