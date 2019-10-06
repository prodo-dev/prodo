import * as React from "react";
import App from "./App";
import { model } from "./model";
import { initState } from "./store";

export * from "./App/DevTools";
export * from "./types";

import "./styles/index.scss";
import { eventListener } from "./utils/communication";

const { Provider, store } = model.createStore({ initState });

window.addEventListener("message", eventListener(store.dispatch));

interface Props {
  children?: React.ReactNode;
  skipUserApp?: boolean;
}

const DevToolsApp = (props: Props) => (
  <Provider>
    <App
      skipUserApp={props.skipUserApp}
      // The below is used when devtools are not used as a wrapper component
      url={!props.children ? "http://localhost:8080" : undefined}
    >
      {props.children}
    </App>
    {/* Temporary fix for react-modal (at least in kanban example) */}
    <div id="modal" className="modal" />
  </Provider>
);

export default DevToolsApp;
