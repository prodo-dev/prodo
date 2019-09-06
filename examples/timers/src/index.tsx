import { ProdoProvider } from "@prodo/core";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { setupStreams } from "./actions";
import App from "./App";
import { model } from "./store";

import "./index.scss";

const store = model.createStore({ initState: {} });

ReactDOM.render(
  <ProdoProvider value={store}>
    <App />
  </ProdoProvider>,
  document.getElementById("root"),
);

store.dispatch(setupStreams)();
