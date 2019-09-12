// tslint:disable:no-console

import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { initState, model } from "./model";

import "./index.scss";

const { Provider } = model.createStore({
  initState,
  delay: 1000,
  possibilities: [
    "peachpuff",
    "hotpink",
    "crimson",
    "deeppink",
    "coral",
    "yellow",
    "lavender",
    "rebeccapuple",
    "slateblue",
    "lime",
    "mediumspringgreen",
    "aqua",
    "deepskyblue",
    "royalblue",
    "lavenderblush",
    "mistyrose",
  ],
});

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById("root"),
);
