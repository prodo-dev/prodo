import { Action } from ".";

export type Destination = "devtools" | "app";

export type DevMessageType = "completedEvent" | "state";
export type DevMessage =
  | {
      destination: "devtools";
      type: "completedEvent";
      contents: {
        event: Action;
      };
    }
  | {
      destination: "devtools";
      type: "state";
      contents: {
        state: any;
      };
    };

export type AppMessageType = "updateState";
export type AppMessage =
  | {
      destination: "app";
      type: "updateState";
      contents: {
        path: string[];
        newValue: any;
      };
    }
  | {
      destination: "app";
      type: AppMessageType;
      contents?: any;
    };

export type Message = DevMessage | AppMessage;
