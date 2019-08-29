import * as babel from "@babel/core";
import visitor from "../src/components-and-actions";

import "./setup";

describe("action transpilation", () => {
  it("can transpile an arrow function action", () => {
    const sourceCode = `
      import { state } from "./src/model";
      const myAction = () => {
        state.foo = "foo";
      }
    `;

    const transpiled = babel.transform(sourceCode, {
      plugins: [{ visitor: visitor(babel) }],
    }).code;

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state } from "./src/model";
      const myAction = model.action(({
        state
      }) => () => {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("doesn't transpile something that doesn't use the universe", () => {
    const sourceCode = `
      import { initState } from "./src/model";
      const state = {
        foo: "foo"
      };

      const myAction = () => {
        return initState.foo === state.foo;
      }
    `;

    const transpiled = babel.transform(sourceCode, {
      plugins: [{ visitor: visitor(babel) }],
    }).code;

    expect(transpiled).toHaveTheSameASTAs(sourceCode);
  });

  it("can transpile a function expression action", () => {
    const sourceCode = `
      import { state } from "./src/model";
      const myAction = function () {
        state.foo = "foo";
      }
    `;

    const transpiled = babel.transform(sourceCode, {
      plugins: [{ visitor: visitor(babel) }],
    }).code;

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state } from "./src/model";
      const myAction = model.action(({
        state
      }) => () => {
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

    const transpiled = babel.transform(sourceCode, {
      plugins: [{ visitor: visitor(babel) }],
    }).code;

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state } from "./src/model";
      const myAction = model.action(({
        state
      }) => () => {
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

    const transpiled = babel.transform(sourceCode, {
      plugins: [{ visitor: visitor(babel) }],
    }).code;

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

    const transpiled = babel.transform(sourceCode, {
      plugins: [{ visitor: visitor(babel) }],
    }).code;

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state as s } from "./src/model";
      const myAction = model.action(({
        state: s
      }) => () => {
        s.foo = "foo";
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

    const transpiled = babel.transform(sourceCode, {
      plugins: [{ visitor: visitor(babel) }],
    }).code;

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

    const transpiled = babel.transform(sourceCode, {
      plugins: [{ visitor: visitor(babel) }],
    }).code;

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state } from "./src/model";
      export const myAction = model.action(({
        state
      }) => () => {
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

    const transpiled = babel.transform(sourceCode, {
      plugins: [{ visitor: visitor(babel) }],
    }).code;

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state } from "./src/model";
      export const myAction = model.action(({
        state
      }) => () => {
        state.foo = "foo";
      }, "myAction");
    `);
  });

  it("passes down the universe", () => {
    const sourceCode = `
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
      plugins: [{ visitor: visitor(babel) }],
    }).code;

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state, dispatch as d, effect } from "./src/model";
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

    const transpiled = babel.transform(sourceCode, {
      plugins: [{ visitor: visitor(babel) }],
    }).code;

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

  it("doesn't pass blacklisted imports from the model to the universe", () => {
    const sourceCode = `
      import { state, initState } from "./src/model";
      const foo = initState.foo;
      const myAction = () => {
        state.foo = initState.foo;
      }
    `;

    const transpiled = babel.transform(sourceCode, {
      plugins: [{ visitor: visitor(babel) }],
    }).code;

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state, initState } from "./src/model";
      const foo = initState.foo;
      const myAction = model.action(({
        state
      }) => () => {
        state.foo = initState.foo;
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

    const transpiled = babel.transform(sourceCode, {
      plugins: [{ visitor: visitor(babel) }],
    }).code;

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

    const transpiled = babel.transform(sourceCode, {
      plugins: [{ visitor: visitor(babel) }],
    }).code;

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state } from "./src/model";
      const myAction = model.action(({
        state
      }) => () => {
        state.foo = "foo";
      }, "myAction");
    `);
  });
});
