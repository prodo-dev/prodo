import * as React from "react";
import * as ReactDOM from "react-dom";
import { setupStreams } from "./actions";
import App from "./App";
import { initState, model } from "./store";

import "./index.scss";

const { store, Provider } = model.createStore({ initState });

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById("root"),
);

store.dispatch(setupStreams)();
