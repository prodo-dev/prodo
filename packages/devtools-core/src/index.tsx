import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { model } from "./model";
import { initState } from "./store";

import "./styles.css";

export * from "./DevTools";

const store = model.createStore({ initState });
const { Provider } = store;

interface Props {
  children?: React.ReactNode;
}

const DevToolsApp = (props: Props) => (
  <Provider>
    <App url={!props.children && "http://localhost:1234"}>{props.children}</App>
  </Provider>
);

ReactDOM.render(<DevToolsApp />, document.getElementById("root"));

export default DevToolsApp;
