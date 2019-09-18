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
      prettyPrint(e);
    }
  },
};

function prettyPrint(e: any) {
  // tslint:disable:no-console
  console.groupCollapsed(
    "%c%s",
    "background: #20e3a0; font-size: 12px; font-weight: bold; padding: 4px; border-radius: 3px;",
    e.actionName,
  );
  console.log("%c%s", "background: lightgrey; padding: 3px;", "origin", {
    id: e.id,
    parent: e.parentId,
    args: e.args,
  });
  console.log("%c%s", "background: lightblue; padding: 3px;", "data", {
    prev: e.prevUniverse,
    next: e.nextUniverse,
    patches: e.patches,
  });
  console.log("%c%s", "background: #f7b1b1; padding: 3px;", "effects", {
    records: e.recordedEffects,
    rerender: e.rerender,
  });
  console.groupEnd();
}

export default loggerPlugin;
