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
  console.group(
    "%c%s",
    "background: #20e3a0; font-size: 12px; font-weight: bold; padding: 4px; border-radius: 3px;",
    e.actionName,
    ...e.args,
  );
  console.log(
    "%c%s",
    "background: lightblue; padding: 3px;",
    "prev",
    e.prevUniverse,
  );
  console.log(
    "%c%s",
    "background: #f7b1b1; padding: 3px;",
    "next",
    e.nextUniverse,
  );
  console.log("%c%s", "background: lightgrey; padding: 3px;", "meta", {
    id: e.id,
    parentId: e.parentId,
    patches: e.patches,
    nextActions: e.nextActions,
    rerender: e.rerender,
    recordedEffects: e.recordedEffects,
  });
  console.groupEnd();
}

export default loggerPlugin;
