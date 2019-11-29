import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { model } from "./model";
import { initState } from "./store";

import "./index.scss";

const { Provider } = model.createStore({
  devtools: true,
  devtoolsServer: {
    port: 8088,
    buttons: {
      saveRenderTest: "Save render test",
      saveActionTest: "Save action test",
    },
  },
  initState,
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
