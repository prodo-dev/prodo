import { createPlugin } from "@prodo/core";

export interface LoggerConfig {
  logger?: boolean;
}

const logger = createPlugin<LoggerConfig, {}, {}, {}>("logger");

logger.init(config => {
  if (config.logger) {
    // tslint:disable-next-line
    console.log("@prodo/logger is on");
  }
});

logger.onCompleteEvent(event => {
  // tslint:disable-next-line
  console.log(event);
});

export default logger;
