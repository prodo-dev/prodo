import * as babel from "@babel/core";
import actionVisitor from "../src/actions";
import { multiline } from "./utils";

describe("action transpilation", () => {
  it("can transpile an arrow function action", () => {
    const sourceCode = multiline`
      import { state } from "./src/model";
      const myAction = () => {
        state.foo = "foo";
      }
    `;

    const transpiled = babel.transform(sourceCode, {
      plugins: [{ visitor: actionVisitor(babel) }],
    }).code;

    expect(transpiled).toEqual(multiline`
      import { model } from "./src/model";
      const myAction = model.action(({
        state
      }) => () => {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("can transpile a function expression action", () => {
    const sourceCode = multiline`
      import { state } from "./src/model";
      const myAction = function () {
        state.foo = "foo";
      }
    `;

    const transpiled = babel.transform(sourceCode, {
      plugins: [{ visitor: actionVisitor(babel) }],
    }).code;

    expect(transpiled).toEqual(multiline`
      import { model } from "./src/model";
      const myAction = model.action(({
        state
      }) => () => {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("can transpile a function declaration action", () => {
    const sourceCode = multiline`
      import { state } from "./src/model";
      function myAction () {
        state.foo = "foo";
      }
    `;

    const transpiled = babel.transform(sourceCode, {
      plugins: [{ visitor: actionVisitor(babel) }],
    }).code;

    expect(transpiled).toEqual(multiline`
      import { model } from "./src/model";
      const myAction = model.action(({
        state
      }) => () => {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("can transpile an action that imports the namespace", () => {
    const sourceCode = multiline`
      import * as prodo from "./src/model";
      const myAction = () => {
        prodo.state.foo = "foo";
      }
    `;

    const transpiled = babel.transform(sourceCode, {
      plugins: [{ visitor: actionVisitor(babel) }],
    }).code;

    expect(transpiled).toEqual(multiline`
      import * as prodo from "./src/model";
      const myAction = prodo.model.action(prodo => () => {
        prodo.state.foo = "foo";
      }, "myAction");
    `);
  });

  it("can transpile an action that renames the import", () => {
    const sourceCode = multiline`
      import { state as s } from "./src/model";
      const myAction = () => {
        s.foo = "foo";
      }
    `;

    const transpiled = babel.transform(sourceCode, {
      plugins: [{ visitor: actionVisitor(babel) }],
    }).code;

    expect(transpiled).toEqual(multiline`
      import { model } from "./src/model";
      const myAction = model.action(({
        state: s
      }) => () => {
        s.foo = "foo";
      }, "myAction");
    `);
  });

  it("can transpile an exported arrow function expression action", () => {
    const sourceCode = multiline`
      import { state } from "./src/model";
      export const myAction = () => {
        state.foo = "foo";
      }
    `;

    const transpiled = babel.transform(sourceCode, {
      plugins: [{ visitor: actionVisitor(babel) }],
    }).code;

    expect(transpiled).toEqual(multiline`
      import { model } from "./src/model";
      export const myAction = model.action(({
        state
      }) => () => {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("can transpile an exported function expression action", () => {
    const sourceCode = multiline`
      import { state } from "./src/model";
      export const myAction = function () {
        state.foo = "foo";
      }
    `;

    const transpiled = babel.transform(sourceCode, {
      plugins: [{ visitor: actionVisitor(babel) }],
    }).code;

    expect(transpiled).toEqual(multiline`
      import { model } from "./src/model";
      export const myAction = model.action(({
        state
      }) => () => {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("can transpile an exported function declaration action", () => {
    const sourceCode = multiline`
      import { state } from "./src/model";
      export function myAction () {
        state.foo = "foo";
      }
    `;

    const transpiled = babel.transform(sourceCode, {
      plugins: [{ visitor: actionVisitor(babel) }],
    }).code;

    expect(transpiled).toEqual(multiline`
      import { model } from "./src/model";
      export const myAction = model.action(({
        state
      }) => () => {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("can passes down the universe", () => {
    const sourceCode = multiline`
      import { state, dispatch as d, effect } from "./src/model";
      import { anotherAction } from "./another";
      import { myEffect } from "./effect";
      const myAction = () => {
        state.foo = "foo";
        d(anotherAction)();
        const result = effect(myEffect)();
      }
    `;

    const transpiled = babel.transform(sourceCode, {
      plugins: [{ visitor: actionVisitor(babel) }],
    }).code;

    expect(transpiled).toEqual(multiline`
      import { model } from "./src/model";
      import { anotherAction } from "./another";
      import { myEffect } from "./effect";
      const myAction = model.action(({
        state,
        dispatch: d,
        effect
      }) => () => {
        state.foo = "foo";
        d(anotherAction)();
        const result = effect(myEffect)();
      }, "myAction");
    `);
  });
});
