import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { model } from "./model";
import { initState } from "./store";

import "./styles/index.css";

export * from "./DevTools";
export * from "./types";

const store = model.createStore({ initState, logger: true });
const { Provider } = store;

interface Props {
  children?: React.ReactNode;
  skipUserApp?: boolean;
}

const DevToolsApp = (props: Props) => (
  <Provider>
    <App
      skipUserApp={props.skipUserApp}
      url={!props.children ? "http://localhost:1234" : undefined}
    >
      {props.children}
    </App>
  </Provider>
);

ReactDOM.render(<DevToolsApp />, document.getElementById("root"));

export default DevToolsApp;
