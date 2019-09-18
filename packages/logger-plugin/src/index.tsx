import { ProdoPlugin } from "@prodo/core";

export interface LoggerConfig {
  logger?: boolean;
}

const init = (config: LoggerConfig) => {
  if (config.logger) {
    // tslint:disable-next-line:no-console
    console.log("@prodo/logger is on");
  }
};

const loggerPlugin: ProdoPlugin<LoggerConfig, {}, {}, {}> = {
  name: "logger",
  init,
  onCompletedEvent: (e, config) => {
    if (config.logger) {
      // tslint:disable-next-line:no-console
      console.log(e);
    }
  },
};

export default loggerPlugin;
