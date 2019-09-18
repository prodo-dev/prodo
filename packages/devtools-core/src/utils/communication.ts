import { Dispatch } from "@prodo/core/lib/types";
import { state } from "../model";
import { Action, AppMessage, DevMessage } from "../types";

const recordState = (newState: any) => {
  state.app.state = newState;
};

const recordAction = (action: Action) => {
  state.app.actionLog.push(action);
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