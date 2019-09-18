import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { model } from "./model";
import { initState } from "./store";

import "./styles/index.css";

export * from "./App/DevTools";
export * from "./types";

const store = model.createStore({ initState });
const { Provider } = store;

interface Props {
  children?: React.ReactNode;
  skipUserApp?: boolean;
}

const DevToolsApp = (props: Props) => (
  <Provider>
    <App
      skipUserApp={props.skipUserApp}
      // The below is used when devtools are not used as a wrapper component
      url={!props.children ? "http://localhost:1234" : undefined}
    >
      {props.children}
    </App>
  </Provider>
);

ReactDOM.render(<DevToolsApp />, document.getElementById("root"));

export default DevToolsApp;
