import { ProdoPlugin } from "@prodo/core";

export interface Config {
  logger?: boolean;
}

const init = (config: Config) => {
  if (config.logger) console.log("Using logger...");
};

const loggerPlugin = (): ProdoPlugin<Config, {}, {}, {}> => ({
  name: "logger",
  init,
});

export default loggerPlugin;
