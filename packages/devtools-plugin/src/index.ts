import { createPlugin, ProdoPlugin } from "@prodo/core/lib/plugins";
import { Event } from "@prodo/core/lib/types";
import DevTools, { DevMessage } from "@prodo/devtools-core";
import { original } from "immer";
import * as _ from "lodash";

export interface DevToolsConfig {
  devtools?: boolean;
}

export interface DevToolsUniverse<State> {
  state: State;
}

const serialize = (data: any) => {
  return JSON.parse(JSON.stringify(data));
};

const devToolsPlugin = <State>(): ProdoPlugin<
  DevToolsConfig,
  DevToolsUniverse<State>,
  { state: State },
  {}
> => {
  const plugin = createPlugin<
    DevToolsConfig,
    DevToolsUniverse<State>,
    { state: State },
    {}
  >("devtools");

  // Wrap user app in devtools, unless we're in test mode
  if (process.env.NODE_ENV !== "test") {
    const onCompleteEventFn = (e: Event) => {
      const message: DevMessage = {
        destination: "devtools",
        type: "completedEvent",
        contents: { event: serialize(e) },
      };
      window.parent.postMessage(message, "*");
    };
    const updateStateAction = plugin.action(
      ctx => ({ path, newValue }) => _.set(ctx.state as any, path, newValue),
      "updateState",
    );
    const initFn = (
      config: DevToolsConfig,
      universe: DevToolsUniverse<State>,
      store: any,
    ) => {
      if (config.devtools) {
        plugin.setProvider(DevTools);
        plugin.onCompleteEvent(onCompleteEventFn);
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

  return plugin;
};

export default devToolsPlugin;
