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

logger.onCompleteEvent((event, config) => {
  if (config.logger) {
    prettyPrint(event);
  }
});

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

export default logger;
