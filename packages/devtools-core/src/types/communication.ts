import { Action } from ".";

export type Destination = "devtools" | "app";

// The API isn't fully finalized yet, so there are generic App- and DevMessageType options
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
    }
  | {
      destination: "devtools";
      type: DevMessageType;
      contents?: any;
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
