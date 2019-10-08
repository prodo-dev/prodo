import { Dispatch } from "@prodo/core/lib/types";
import { state } from "../model";
import { Action, AppMessage, DevMessage } from "../types";

export const recordUniverse = (newUniverse: any) => {
  state.app.universe = newUniverse;
};

export const recordAction = (action: Action) => {
  state.app.actionLog.push(action);
  if (action.rerender && Object.keys(action.rerender).length > 0) {
    Object.keys(action.rerender).forEach(rerender => {
      const renderLogEntry = {
        componentId: rerender,
        actionName: action.actionName,
      };
      state.app.renderLog.push(renderLogEntry);
    });
  }
};

export const eventListener = (dispatch: Dispatch) => (event: MessageEvent) => {
  if (!event.data || typeof event.data !== "string") {
    return;
  }
  const message: DevMessage = JSON.parse(event.data);
  if (message.destination !== "devtools") {
    return;
  }
  if (message.type === "universe") {
    dispatch(recordUniverse)(message.contents.universe);
  } else if (message.type === "completedEvent") {
    const completedEvent: Action = message.contents.event;
    dispatch(recordAction)(completedEvent);
    if (completedEvent.nextUniverse) {
      dispatch(recordUniverse)(completedEvent.nextUniverse);
    }
  }
};

export const sendMessage = (
  message: Partial<AppMessage> & Pick<AppMessage, "type">,
) => {
  const appMessage: AppMessage = { destination: "app", ...message };
  window.postMessage(appMessage, "*");
};
