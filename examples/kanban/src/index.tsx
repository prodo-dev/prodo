import * as React from "react";
import * as ReactDOM from "react-dom";
import ErrorBoundary from "react-error-boundary";
import App from "./components/App";
import { Provider, store } from "./store";
import "./styles.scss";

// @ts-ignore
window.store = store; // for debugging

const render = () => {
  ReactDOM.render(
    <ErrorBoundary>
      <Provider>
        <App />
      </Provider>
    </ErrorBoundary>,
    document.getElementById("root"),
  );
};

if (module.hot) {
  module.hot.accept("./App", () => {
    render();
  });
}

render();
