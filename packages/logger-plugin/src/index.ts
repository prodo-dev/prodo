import { createPlugin } from "@prodo/core";

export interface LoggerConfig {
  logger?: boolean;
}

const plugin = createPlugin<LoggerConfig, {}, {}, {}>("logger");

plugin.init(config => {
  if (config.logger) {
    // tslint:disable-next-line
    console.log("@prodo/logger is on");
  }
});

plugin.onCompleteEvent(event => {
  // tslint:disable-next-line
  console.log(event);
});

export default plugin;
