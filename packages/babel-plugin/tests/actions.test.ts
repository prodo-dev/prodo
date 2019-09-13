import * as babel from "@babel/core";
import visitor from "../src/components-and-actions";

import "./setup";

const transform = (sourceCode: string, filename?: string): string =>
  babel.transform(sourceCode, {
    plugins: [{ visitor: visitor(babel) }],
    filename,
  })!.code!;

describe("action transpilation", () => {
  it("can transpile an arrow function action", () => {
    const sourceCode = `
      import { state } from "./src/model";
      const myAction = () => {
        state.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state } from "./src/model";
      const myAction = model.action(({
        state
      }) => () => {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("can detect the universe from model.ctx", () => {
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

  it("can detect the universe from explicit js files", () => {
    const sourceCode = `
      import { state } from "./src/model.js";
      const myAction = () => {
        state.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state } from "./src/model.js";
      const myAction = model.action(({
        state
      }) => () => {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("can detect the universe from explicit ts files", () => {
    const sourceCode = `
      import { state } from "./src/model.ts";
      const myAction = () => {
        state.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state } from "./src/model.ts";
      const myAction = model.action(({
        state
      }) => () => {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("can transpile a function expression action", () => {
    const sourceCode = `
      import { state } from "./src/model";
      const myAction = function () {
        state.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state } from "./src/model";
      const myAction = model.action(({
        state
      }) => function () {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("can transpile a function declaration action", () => {
    const sourceCode = `
      import { state } from "./src/model";
      function myAction () {
        state.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state } from "./src/model";
      const myAction = model.action(({
        state
      }) => function () {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("can transpile an action that imports the namespace", () => {
    const sourceCode = `
      import * as prodo from "./src/model";
      const myAction = () => {
        prodo.state.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
    import * as prodo from "./src/model";
    const myAction = prodo.model.action(prodo => () => {
        prodo.state.foo = "foo";
      }, "myAction");
    `);
  });

  it("can transpile an action that renames the import", () => {
    const sourceCode = `
      import { state as s } from "./src/model";
      const myAction = () => {
        s.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state as s } from "./src/model";
      const myAction = model.action(({
        state: s
      }) => () => {
        s.foo = "foo";
      }, "myAction");
    `);
  });

  it("can transpile an action that uses require syntax", () => {
    const sourceCode = `
      const prodo = require("./src/model");
      const myAction = () => {
        prodo.state.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      const prodo = require("./src/model");
      const myAction = model.action(prodo => () => {
        prodo.state.foo = "foo";
      }, "myAction");
    `);
  });

  it("can transpile an action that uses require syntax with spread", () => {
    const sourceCode = `
      const { state } = require("./src/model");
      const myAction = () => {
        state.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      const { state }= require("./src/model");
      const myAction = model.action(({ state }) => () => {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("can transpile an exported arrow function expression action", () => {
    const sourceCode = `
      import { state } from "./src/model";
      export const myAction = () => {
        state.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state } from "./src/model";
      export const myAction = model.action(({
        state
      }) => () => {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("can transpile an exported function expression action", () => {
    const sourceCode = `
      import { state } from "./src/model";
      export const myAction = function () {
        state.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state } from "./src/model";
      export const myAction = model.action(({
        state
      }) => function () {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("can transpile an exported function declaration action", () => {
    const sourceCode = `
      import { state } from "./src/model";
      export function myAction () {
        state.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state } from "./src/model";
      export const myAction = model.action(({
        state
      }) => function () {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("passes down the universe", () => {
    const sourceCode = `
      import { dispatch as d, effect, state } from "./src/model";
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
      import { model, dispatch as d, effect, state } from "./src/model";
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
      import { state } from "./src/model";
      const myAction = (foo, {
        bar
      }) => {
        state.foo = foo;
        state.bar = bar;
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state } from "./src/model";
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
      import { state } from "./src/model";
      const myAction = () => {
        state.foo = "foo";
      }
      const myOtherAction = () => {
        state.bar = "bar";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state } from "./src/model";
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
      import { model, state } from "./src/model";
      const myAction = () => {
        state.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state } from "./src/model";
      const myAction = model.action(({
        state
      }) => () => {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("doesn't import the model if it's already imported under a different name", () => {
    const sourceCode = `
      import { model as m, state } from "./src/model";
      const myAction = () => {
        state.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model as m, state } from "./src/model";
      const myAction = m.action(({
        state
      }) => () => {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("doesn't crash on undefined identifiers", () => {
    const sourceCode = `
      import { state } from "./src/model";
      const myAction = () => {
        state.foo = foo;
      };
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state } from "./src/model";
      const myAction = model.action(({
        state
      }) => () => {
        state.foo = foo;
      }, "myAction");
    `);
  });

  it("compiles commonjs export syntax", () => {
    const sourceCode = `
      import { state } from "./src/model";
      exports.myAction = () => {
        state.foo = "foo";
      };
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state } from "./src/model";
      exports.myAction = model.action(({
        state
      }) => () => {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("compiles default exports", () => {
    const sourceCode = `
      import { state } from "./src/model";
      export default () => {
        state.foo = "foo";
      };
    `;

    const transpiled = transform(sourceCode, "src/action.ts");

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state } from "./src/model";
      export default model.action(({
        state
      }) => () => {
        state.foo = "foo";
      }, "action");
    `);
  });

  it("compiles default exports inside index files", () => {
    const sourceCode = `
      import { state } from "./src/model";
      export default () => {
        state.foo = "foo";
      };
    `;

    const transpiled = transform(sourceCode, "src/action/index.ts");

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state } from "./src/model";
      export default model.action(({
        state
      }) => () => {
        state.foo = "foo";
      }, "action");
    `);
  });

  it("removes special characters when compiling default exports", () => {
    const sourceCode = `
      import { state } from "./src/model";
      export default () => {
        state.foo = "foo";
      };
    `;

    const transpiled = transform(sourceCode, "src/my-action.ts");

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state } from "./src/model";
      export default model.action(({
        state
      }) => () => {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("transpiles async function declarations", () => {
    const sourceCode = `
      import { state } from "./model";
      async function myAction () {
        state.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state } from "./model";
      const myAction = model.action(({
        state
      }) => async function () {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("transpiles async function expressions", () => {
    const sourceCode = `
      import { state } from "./model";
      const myAction = async function () {
        state.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state } from "./model";
      const myAction = model.action(({
        state
      }) => async function () {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("transpiles async arrow function expressions", () => {
    const sourceCode = `
      import { state } from "./model";
      const myAction = async () => {
        state.foo = "foo";
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state } from "./model";
      const myAction = model.action(({
        state
      }) => async () => {
        state.foo = "foo";
      }, "myAction");
    `);
  });
});
