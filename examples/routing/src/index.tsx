import { createBrowserHistory } from "history";
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { model } from "./model";
import { initState } from "./store";

import "./index.scss";

const history = createBrowserHistory();

const { store, Provider } = model.createStore({
  initState,
  route: { history },
});

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById("root"),
);

(window as any).store = store;
