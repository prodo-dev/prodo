import { createPlugin } from "@prodo/core";
import { Event } from "@prodo/core/lib/types";
import DevTools, { DevMessage } from "@prodo/devtools-core";
import { original } from "immer";
import * as _ from "lodash";

export interface DevToolsConfig {
  devtools?: boolean;
  devtoolsServer?: {
    port: number;
    buttons: { [key: string]: string };
  };
}

// tslint:disable-next-line:no-empty-interface
export interface DevToolsUniverse {}

const serialize = (data: any) => {
  return JSON.stringify(data);
};

const postMessage = (message: DevMessage) => {
  window.parent.postMessage(serialize(message), "*");
};

const plugin = createPlugin<DevToolsConfig, DevToolsUniverse, {}, {}>(
  "devtools",
);

// Wrap user app in devtools, unless we're in test mode
if (process.env.NODE_ENV !== "test") {
  const onCompleteEventFn = ({ event }: { event: Event }) => {
    const message: DevMessage = {
      destination: "devtools",
      type: "completedEvent",
      contents: { event },
    };
    postMessage(message);
  };
  const updateStateAction = plugin.action(
    ctx => ({ path, newValue }) =>
      _.set((ctx as any).state as any, path, newValue),
    "updateState",
  );
  const initFn = (
    config: DevToolsConfig,
    universe: DevToolsUniverse,
    store: any,
  ) => {
    if (config.devtools) {
      plugin.setProvider(DevTools);
      plugin.onCompleteEvent(onCompleteEventFn);
      const exposedUniverse = original(universe);
      (store.exposedUniverseVars || []).forEach(
        (exposedUniverseVar: string) =>
          (exposedUniverse[exposedUniverseVar] = universe[exposedUniverseVar]),
      );
      //
      if (config.devtoolsServer) {
        (window as any).devtoolsServer = config.devtoolsServer;
      }
      // Send initial state to devtools
      const message: DevMessage = {
        destination: "devtools",
        type: "universe",
        contents: { universe: exposedUniverse },
      };
      postMessage(message);
      // Add listener for devtools events
      window.addEventListener("message", event => {
        if (event.data.destination === "app") {
          if (event.data.type === "updateState") {
            store.dispatch(updateStateAction)(event.data.contents);
          } else {
            // tslint:disable-next-line:no-console
            console.warn(
              "Devtools got message with unimplemented type",
              event.data,
            );
          }
        }
      });
    }
  };
  plugin.init(initFn);
}

export default plugin;
