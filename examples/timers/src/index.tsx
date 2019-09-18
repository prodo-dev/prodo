import * as React from "react";
import * as ReactDOM from "react-dom";
import { setupStreams } from "./actions";
import App from "./App";
import { model } from "./store";

import "./index.scss";

const { store, Provider } = model.createStore({ initState: {} });

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

store.dispatch(setupStreams)();
