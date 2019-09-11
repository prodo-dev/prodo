import * as babel from "@babel/core";
import visitor from "../src/components-and-actions";

import "./setup";

const transform = (sourceCode: string): string =>
  babel.transform(sourceCode, {
    plugins: [{ visitor: visitor(babel) }],
  })!.code!;

describe("action transpilation", () => {
  it("can transpile an arrow function action", () => {
    const sourceCode = `
      import { state } from "./src/model.ctx";
      const myAction = () => {
        state.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      import { state } from "./src/model.ctx";
      const myAction = model.action(({
        state
      }) => () => {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("doesn't transpile something that doesn't use the ctx", () => {
    const sourceCode = `
      import { initState } from "./src/model";
      const state = {
        foo: "foo"
      };

      const myAction = () => {
        return initState.foo === state.foo;
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(sourceCode);
  });

  it("can transpile a function expression action", () => {
    const sourceCode = `
      import { state } from "./src/model.ctx";
      const myAction = function () {
        state.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      import { state } from "./src/model.ctx";
      const myAction = model.action(({
        state
      }) => function () {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("can transpile a function declaration action", () => {
    const sourceCode = `
      import { state } from "./src/model.ctx";
      function myAction () {
        state.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      import { state } from "./src/model.ctx";
      const myAction = model.action(({
        state
      }) => function myAction () {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("can transpile an action that imports the namespace", () => {
    const sourceCode = `
      import * as prodo from "./src/model.ctx";
      const myAction = () => {
        prodo.state.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      import * as prodo from "./src/model.ctx";
      const myAction = model.action(prodo => () => {
        prodo.state.foo = "foo";
      }, "myAction");
    `);
  });

  it("can transpile an action that renames the import", () => {
    const sourceCode = `
      import { state as s } from "./src/model.ctx";
      const myAction = () => {
        s.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      import { state as s } from "./src/model.ctx";
      const myAction = model.action(({
        state: s
      }) => () => {
        s.foo = "foo";
      }, "myAction");
    `);
  });

  it("can transpile an action that uses require syntax", () => {
    const sourceCode = `
      const prodo = require("./src/model.ctx");
      const myAction = () => {
        prodo.state.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      const prodo = require("./src/model.ctx");
      const myAction = model.action(prodo => () => {
        prodo.state.foo = "foo";
      }, "myAction");
    `);
  });

  it("can transpile an action that uses require syntax with spread", () => {
    const sourceCode = `
      const { state } = require("./src/model.ctx");
      const myAction = () => {
        state.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      const { state }= require("./src/model.ctx");
      const myAction = model.action(({ state }) => () => {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("can transpile an exported arrow function expression action", () => {
    const sourceCode = `
      import { state } from "./src/model.ctx";
      export const myAction = () => {
        state.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      import { state } from "./src/model.ctx";
      export const myAction = model.action(({
        state
      }) => () => {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("can transpile an exported function expression action", () => {
    const sourceCode = `
      import { state } from "./src/model.ctx";
      export const myAction = function () {
        state.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      import { state } from "./src/model.ctx";
      export const myAction = model.action(({
        state
      }) => function () {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("can transpile an exported function declaration action", () => {
    const sourceCode = `
      import { state } from "./src/model.ctx";
      export function myAction () {
        state.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      import { state } from "./src/model.ctx";
      export const myAction = model.action(({
        state
      }) => function myAction () {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("passes down the universe", () => {
    const sourceCode = `
      import { dispatch as d, effect, state } from "./src/model.ctx";
      import { anotherAction } from "./another";
      import { myEffect } from "./effect";
      const myAction = () => {
        state.foo = "foo";
        d(anotherAction)();
        const result = effect(myEffect)();
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      import { dispatch as d, effect, state } from "./src/model.ctx";
      import { anotherAction } from "./another";
      import { myEffect } from "./effect";
      const myAction = model.action(({
        dispatch: d,
        effect,
        state
      }) => () => {
        state.foo = "foo";
        d(anotherAction)();
        const result = effect(myEffect)();
      }, "myAction");
    `);
  });

  it("passes args", () => {
    const sourceCode = `
      import { state } from "./src/model.ctx";
      const myAction = (foo, {
        bar
      }) => {
        state.foo = foo;
        state.bar = bar;
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      import { state } from "./src/model.ctx";
      const myAction = model.action(({
        state
      }) => (foo, {
        bar
      }) => {
        state.foo = foo;
        state.bar = bar;
      }, "myAction");
    `);
  });

  it("can transpile multiple actions", () => {
    const sourceCode = `
      import { state } from "./src/model.ctx";
      const myAction = () => {
        state.foo = "foo";
      }
      const myOtherAction = () => {
        state.bar = "bar";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      import { state } from "./src/model.ctx";
      const myAction = model.action(({
        state
      }) => () => {
        state.foo = "foo";
      }, "myAction");
      const myOtherAction = model.action(({
        state
      }) => () => {
        state.bar = "bar";
      }, "myOtherAction");
    `);
  });

  it("doesn't import the model if it's already imported", () => {
    const sourceCode = `
      import { model } from "./src/model";
      import { state } from "./src/model.ctx";
      const myAction = () => {
        state.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      import { state } from "./src/model.ctx";
      const myAction = model.action(({
        state
      }) => () => {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("doesn't crash on undefined identifiers", () => {
    const sourceCode = `
      import { state } from "./src/model.ctx";
      const myAction = () => {
        state.foo = foo;
      };
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      import { state } from "./src/model.ctx";
      const myAction = model.action(({
        state
      }) => () => {
        state.foo = foo;
      }, "myAction");
    `);
  });

  it("compiles commonjs export syntax", () => {
    const sourceCode = `
      import { state } from "./src/model.ctx";
      exports.myAction = () => {
        state.foo = "foo";
      };
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      import { state } from "./src/model.ctx";
      exports.myAction = model.action(({
        state
      }) => () => {
        state.foo = "foo";
      }, "myAction");
    `);
  });
});
