import * as React from "react";
import * as ReactDOM from "react-dom";
import ErrorBoundary from "react-error-boundary";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import { Provider, store } from "./store";
import "./styles.scss";

// @ts-ignore
window.store = store; // for debugging

const render = () => {
  ReactDOM.render(
    <ErrorBoundary>
      <BrowserRouter>
        <Provider>
          <App />
        </Provider>
      </BrowserRouter>
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
