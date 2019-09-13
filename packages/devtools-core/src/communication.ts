import { state } from "./model";

const recordState = (newState: any) => {
  state.app.state = newState;
};

const recordAction = (action: any) => {
  state.app.actionLog.push(action);
};

// TODO: types
export const eventListener = (dispatch: any) => (event: MessageEvent) => {
  if (event.data.destination === "devtools") {
    // tslint:disable-next-line:no-console
    console.log("Devtools got message", event.data);
    if (event.data.type === "state") {
      dispatch(recordState)(event.data.contents);
    }
    if (event.data.type === "completedEvent") {
      dispatch(recordAction)(event.data.contents);
    }
  }
};
