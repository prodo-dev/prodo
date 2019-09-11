import { ProdoPlugin } from "@prodo/core";

export type LoggerConfig = {
  logger?: boolean;
};

const init = (config: LoggerConfig) => {
  if (config.logger) console.log("@prodo/logger is on");
};

const loggerPlugin: ProdoPlugin<LoggerConfig, {}, {}, {}> = {
  name: "logger",
  init,
  onCompletedEvent: e => {
    console.log(e);
  },
};

export default loggerPlugin;
