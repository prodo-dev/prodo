import { ProdoPlugin } from "@prodo/core";

export interface LoggerConfig {
  logger?: boolean;
}

const init = (config: LoggerConfig) => {
  if (config.logger) {
    // tslint:disable-next-line
    console.log("@prodo/logger is on");
  }
};

const loggerPlugin: ProdoPlugin<LoggerConfig, {}, {}, {}> = {
  name: "logger",
  init,
  onCompletedEvent: e => {
    // tslint:disable-next-line
    console.log(e);
  },
};

export default loggerPlugin;
