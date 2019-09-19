import { createPlugin } from "@prodo/core/lib/plugins";
import { Event } from "@prodo/core/lib/types";
import DevTools, { DevMessage } from "@prodo/devtools-core";
import { original } from "immer";
import * as _ from "lodash";

// tslint:disable-next-line:no-empty-interface
export interface DevToolsConfig {}

export interface DevToolsUniverse {
  state: any;
}

const plugin = createPlugin<
  DevToolsConfig,
  DevToolsUniverse,
  { state: any },
  {}
>("devtools");

// Wrap user app in devtools, unless we're in test mode
if (!process.env.JEST_WORKER_ID) {
  plugin.setProvider(DevTools);

  const onCompleteEventFn = (e: Event) => {
    const message: DevMessage = {
      destination: "devtools",
      type: "completedEvent",
      contents: { event: e },
    };
    window.parent.postMessage(message, "*");
  };
  plugin.onCompleteEvent(onCompleteEventFn);

  const updateStateAction = plugin.action(
    ctx => ({ path, newValue }) => _.set(ctx.state, path, newValue),
    "updateState",
  );

  const initFn = (
    _config: DevToolsConfig,
    universe: DevToolsUniverse,
    store,
  ) => {
    // Send initial state to devtools
    const message: DevMessage = {
      destination: "devtools",
      type: "state",
      contents: { state: original(universe.state) },
    };
    window.parent.postMessage(message, "*");

    // Add listener for devtools events
    window.addEventListener("message", event => {
      if (event.data.destination === "app") {
        if (event.data.type === "updateState") {
          store.dispatch(updateStateAction)(event.data.contents);
        } else {
          // tslint:disable-next-line:no-console
          console.log(
            "Devtools got message with unimplemented type",
            event.data,
          );
        }
      }
    });
  };
  plugin.init(initFn);
}

export default plugin;
