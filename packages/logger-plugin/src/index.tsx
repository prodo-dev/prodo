import { ProdoPlugin } from "@prodo/core";

export type LoggerConfig = {
  logger?: boolean;
};

const init = (config: LoggerConfig) => {
  if (config.logger) console.log("Using logger...");
};

const loggerPlugin: ProdoPlugin<LoggerConfig, {}, {}, {}> = {
  name: "logger",
  init,
};

export default loggerPlugin;
