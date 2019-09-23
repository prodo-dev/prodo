import { State } from "../src/model";

export const testAppState = { foo: "bar", items: [1, 2], test: { a: "b" } };
export const testActionLog = [
  {
    actionName: "actionName1",
    id: "id1",
    parentId: null,
    prevUniverse: { state: {} },
    nextActions: [],
    args: {},
    patches: [],
  },
  {
    actionName: "actionName2",
    id: "id2",
    parentId: null,
    prevUniverse: { state: {} },
    nextActions: [],
    args: {},
    patches: [],
  },
  {
    actionName: "actionName3",
    id: "id3",
    parentId: null,
    prevUniverse: { state: {} },
    nextActions: [],
    args: {},
    patches: [],
  },
];

export const populatedState: State = {
  app: { state: testAppState, actionLog: testActionLog },
  ui: { iframe: null },
};
