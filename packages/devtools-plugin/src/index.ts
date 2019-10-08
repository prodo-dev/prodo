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
  return JSON.stringify(data);
};

const postMessage = (message: DevMessage) => {
  window.parent.postMessage(serialize(message), "*");
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
    const onCompleteEventFn = ({ event }: { event: Event }) => {
      const message: DevMessage = {
        destination: "devtools",
        type: "completedEvent",
        contents: { event },
      };
      postMessage(message);
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
        // TODO: also pass exposed plugin states
        const message: DevMessage = {
          destination: "devtools",
          type: "universe",
          contents: { universe: original(universe) },
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

  return plugin;
};

export default devToolsPlugin;
