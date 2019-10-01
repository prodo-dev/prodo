import { State } from "../src/model";
import { Action, Render } from "../src/types";

export const testAppState = { foo: "bar", items: [1, 2], test: { a: "b" } };
export const testActionLog: Action[] = [
  {
    actionName: "actionName1",
    id: "id1",
    parentId: null,
    prevUniverse: { state: {} },
    nextActions: [],
    args: {},
    patches: [],
    rerender: { Comp1: true },
    pluginName: "",
  },
  {
    actionName: "actionName2",
    id: "id2",
    parentId: null,
    prevUniverse: { state: {} },
    nextActions: [],
    args: {},
    patches: [],
    pluginName: "",
  },
  {
    actionName: "actionName3",
    id: "id3",
    parentId: null,
    prevUniverse: { state: {} },
    nextActions: [],
    args: {},
    patches: [],
    rerender: { Comp1: true, Comp3: true },
    pluginName: "",
  },
];

export const testRenderLog: Render[] = [
  {
    componentId: "Comp1",
    actionName: "actionName1",
  },
  {
    componentId: "Comp1",
    actionName: "actionName3",
  },
  {
    componentId: "Comp3",
    actionName: "actionName3",
  },
];

export const populatedState: State = {
  app: {
    state: testAppState,
    actionLog: testActionLog,
    renderLog: testRenderLog,
  },
  ui: { iframe: null },
};
