import { ProdoPlugin } from "@prodo/core";

export interface Message {
  destination: "devtools" | "app";
  type: string;
  contents: any;
}

export interface DevToolsConfig {
  logger?: boolean;
}

const init = (config: DevToolsConfig) => {
  if (config.logger) {
    // tslint:disable-next-line
    console.log("@prodo/devtools is on");
  }
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
    window.postMessage(message, "*");
    window.parent.postMessage(message, "*");
  },
};

export default devtoolsPlugin;
