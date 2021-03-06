import { Event } from "@prodo/core/lib/types";

export * from "./communication";

export type Panel = "state" | "actionLog" | "renderLog";

interface Universe {
  state: any;
}

// Extend regular Event to ensure we have state in the universe
// Use the name "Action" to be consistent with the UI?
export interface Action extends Event {
  prevUniverse: Universe;
  nextUniverse?: Universe;
  recordedEffects?: any[];
}

export interface Render {
  componentId: string;
  actionName: string;
}
