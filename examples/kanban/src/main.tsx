import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "react-error-boundary";
import App from "./components/App";
import { store, Provider } from "./store";
import "./styles.scss";

//@ts-ignore
window.store = store; // for debugging

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
