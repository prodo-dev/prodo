export type Panel = "state" | "actionLog";

interface Universe {
  state: any;
}

interface Patch {
  op: "replace" | "TODO";
  path: string[];
  value: any;
}

export interface Action {
  id: string;
  parentId: string | null;
  actionName: string;
  args: any;
  nextAction: string[];
  patches: Patch[];
  prevUniverse: Universe;
  nextUniverse: Universe;
  recordedEffects: any[];
  rerender: { [componentId: string]: boolean };
}
