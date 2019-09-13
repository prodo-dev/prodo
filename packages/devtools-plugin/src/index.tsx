import { ProdoPlugin } from "@prodo/core";

export interface Message {
  destination: "devtools" | "app";
  type: string;
  contents: any;
}

// tslint:disable-next-line:no-empty-interface
export interface DevToolsConfig {}

// tslint:disable-next-line:no-empty
const init = (_config: DevToolsConfig) => {};

const devtoolsPlugin: ProdoPlugin<DevToolsConfig, {}, {}, {}> = {
  name: "devtools",
  init,
  onCompletedEvent: e => {
    const message: Message = {
      destination: "devtools",
      type: "completedEvent",
      contents: e,
    };
    window.postMessage(message, "*");
    // TODO: Would perhaps just one be enough?
    window.parent.postMessage(message, "*");
  },
};

export default devtoolsPlugin;
