import { ProdoPlugin } from "@prodo/core";
import { original } from "immer";

export { default as DevTools } from "@prodo/devtools-core";

type Destination = "devtools" | "app";
type MessageType = "completedEvent" | "state";

export interface Message {
  destination: Destination;
  type: MessageType;
  contents: any;
}

// tslint:disable-next-line:no-empty-interface
export interface DevToolsConfig {}

const init = (_config: DevToolsConfig, universe: any) => {
  // Send initial state to devtools
  const message: Message = {
    destination: "devtools",
    type: "state",
    contents: original(universe.state),
  };
  window.parent.postMessage(message, "*");
};

const devtoolsPlugin: ProdoPlugin<DevToolsConfig, {}, {}, {}> = {
  name: "devtools",
  init,
  onCompletedEvent: e => {
    const message: Message = {
      destination: "devtools",
      type: "completedEvent",
      contents: e,
    };
    window.parent.postMessage(message, "*");
  },
};

export default devtoolsPlugin;
