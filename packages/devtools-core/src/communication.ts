import { state } from "./model";

const recordAction = (action: any) => {
  state.app.actionLog.push(action);
};

// TODO: types
export const eventListener = (dispatch: any) => (event: MessageEvent) => {
  if (event.data.destination === "devtools") {
    if (event.data.type === "completedEvent") {
      // tslint:disable-next-line:no-console
      console.log("Devtools got message", event.data);
      dispatch(recordAction)(event.data.contents);
    }
  }
};
