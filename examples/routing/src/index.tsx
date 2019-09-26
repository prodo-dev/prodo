import { createBrowserHistory } from "history";
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { model } from "./model";
import { initState } from "./store";

import "./index.scss";

const history = createBrowserHistory();

const { store, Provider } = model.createStore({
  logger: true,
  initState,
  route: { history },
});

const render = () => {
  ReactDOM.render(
    <Provider>
      <App />
    </Provider>,
    document.getElementById("root"),
  );
};

if (module.hot) {
  module.hot.accept("./App", () => {
    render();
  });
}

render();

(window as any).store = store;
