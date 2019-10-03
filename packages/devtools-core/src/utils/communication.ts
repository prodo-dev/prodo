import { Dispatch } from "@prodo/core/lib/types";
import { state } from "../model";
import { Action, AppMessage, DevMessage } from "../types";

export const recordState = (newState: any) => {
  state.app.state = newState;
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
  if (typeof event.data !== "string") {
    return;
  }
  const message: DevMessage = JSON.parse(event.data);
  if (message.destination !== "devtools") {
    return;
  }
  if (message.type === "state") {
    dispatch(recordState)(message.contents.state);
  } else if (message.type === "completedEvent") {
    const completedEvent: Action = JSON.parse(message.contents.event);
    dispatch(recordAction)(completedEvent);
    if (completedEvent.nextUniverse) {
      dispatch(recordState)(completedEvent.nextUniverse.state);
    }
  }
};

export const sendMessage = (
  message: Partial<AppMessage> & Pick<AppMessage, "type">,
) => {
  const appMessage: AppMessage = { destination: "app", ...message };
  window.postMessage(appMessage, "*");
};
