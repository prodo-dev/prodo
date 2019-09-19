import { ProdoPlugin } from "@prodo/core";
import { Event } from "@prodo/core/lib/types";
import DevTools, { DevMessage } from "@prodo/devtools-core";
import { original } from "immer";

// tslint:disable-next-line:no-empty-interface
export interface DevToolsConfig {}

export interface DevToolsUniverse {
  state: any;
}

const init = (_config: DevToolsConfig, universe: DevToolsUniverse) => {
  // Send initial state to devtools
  if (!process.env.JEST_WORKER_ID) {
    const message: DevMessage = {
      destination: "devtools",
      type: "state",
      contents: { state: original(universe.state) },
    };
    window.parent.postMessage(message, "*");
  }
};

const devtoolsPlugin: ProdoPlugin<DevToolsConfig, DevToolsUniverse, {}, {}> = {
  name: "devtools",
  init,
  Provider: DevTools,
  onCompletedEvent: (e: Event) => {
    if (!process.env.JEST_WORKER_ID) {
      const message: DevMessage = {
        destination: "devtools",
        type: "completedEvent",
        contents: { event: e },
      };
      window.parent.postMessage(message, "*");
    }
  },
};

export default devtoolsPlugin;
