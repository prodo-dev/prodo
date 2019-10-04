import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./App";
import { initState, model } from "./model";

import "./index.scss";

const { Provider } = model.createStore({ initState, logger: true });

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
