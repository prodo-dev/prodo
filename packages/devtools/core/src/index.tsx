import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { model } from "./model";

import "./styles.css";

const { store, Provider } = model.createStore({
  initState: {},
});

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById("root"),
);
