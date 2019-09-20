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
  if (event.data.destination === "devtools") {
    const message: DevMessage = event.data;
    if (message.type === "state") {
      dispatch(recordState)(message.contents.state);
    } else if (message.type === "completedEvent") {
      dispatch(recordAction)(message.contents.event);
      if (message.contents.event.nextUniverse) {
        dispatch(recordState)(message.contents.event.nextUniverse.state);
      }
    }
  }
};

export const sendMessage = (
  message: Partial<AppMessage> & Pick<AppMessage, "type">,
) => {
  const appMessage: AppMessage = { destination: "app", ...message };
  window.postMessage(appMessage, "*");
};
