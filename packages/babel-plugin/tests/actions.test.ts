import * as babel from "@babel/core";
import plugin from "../src";

describe("action transpilation", () => {
  it("can transpile an action", () => {
    const sourceCode = `
import {state} from "./src/model";

const myAction = () => {
state.foo = "foo";
}`;

    const transpiled = babel.transform(sourceCode, {
      plugins: [plugin(babel)],
    }).code;

    expect(transpiled).toEqual(`import { state, model } from "./src/model";
const myAction = model.action(({
  state,
  dispatch
}) => () => {
  state.foo = "foo";
}, "myAction");`);
  });
});
