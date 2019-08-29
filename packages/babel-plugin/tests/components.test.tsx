import * as babel from "@babel/core";
import visitor from "../src/components-and-actions";

import "./setup";

describe("action transpilation", () => {
  it("can transpile an arrow function component", () => {
    const sourceCode = `
      import { state, watch } from "./src/model";
      const MyComponent = () => (
        <div>{watch(state.foo)}</div>
      );
    `;

    const transpiled = babel.transform(sourceCode, {
      plugins: ["@babel/plugin-syntax-jsx", { visitor: visitor(babel) }],
    }).code;

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state, watch } from "./src/model";
      const MyComponent = model.connect(
        ({ state, watch }) => () => <div>{watch(state.foo)}</div>,
        "MyComponent"
      )
    `);
  });

  it("can transpile a function expression component", () => {
    const sourceCode = `
      import { state, watch } from "./src/model";
      const MyComponent = function () {
        return <div>{watch(state.foo)}</div>;
      }
    `;

    const transpiled = babel.transform(sourceCode, {
      plugins: ["@babel/plugin-syntax-jsx", { visitor: visitor(babel) }],
    }).code;

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state, watch } from "./src/model";
      const MyComponent = model.connect(({
        state,
        watch
      }) => () => {
        return <div>{watch(state.foo)}</div>;
      }, "MyComponent");
    `);
  });

  it("can transpile a function declaration component", () => {
    const sourceCode = `
      import { state, watch } from "./src/model";
      function MyComponent () {
        return <div>{watch(state.foo)}</div>;
      }
    `;

    const transpiled = babel.transform(sourceCode, {
      plugins: ["@babel/plugin-syntax-jsx", { visitor: visitor(babel) }],
    }).code;

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state, watch } from "./src/model";
      const MyComponent = model.connect(({
        state,
        watch
      }) => () => {
        return <div>{watch(state.foo)}</div>;
      }, "MyComponent");
    `);
  });

  it("can transpile a component that imports the namespace", () => {
    const sourceCode = `
      import * as prodo from "./src/model";
      const MyComponent = () => {
        return <div>{prodo.watch(prodo.state.foo)}</div>;
      }
    `;

    const transpiled = babel.transform(sourceCode, {
      plugins: ["@babel/plugin-syntax-jsx", { visitor: visitor(babel) }],
    }).code;

    expect(transpiled).toHaveTheSameASTAs(`
      import * as prodo from "./src/model";
      const MyComponent = prodo.model.connect(prodo => () => {
        return <div>{prodo.watch(prodo.state.foo)}</div>;
      }, "MyComponent");
    `);
  });

  it("can transpile a component that renames the import", () => {
    const sourceCode = `
      import { state as s, watch as w } from "./src/model";
      const MyComponent = () => {
        return <div>{w(s.foo)}</div>
      }
    `;

    const transpiled = babel.transform(sourceCode, {
      plugins: ["@babel/plugin-syntax-jsx", { visitor: visitor(babel) }],
    }).code;

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state as s, watch as w } from "./src/model";
      const MyComponent = model.connect(({
        state: s,
        watch: w
      }) => () => {
        return <div>{w(s.foo)}</div>;
      }, "MyComponent");
    `);
  });

  it("can transpile an exported arrow function expression component", () => {
    const sourceCode = `
      import { state, watch } from "./src/model";
      export const MyComponent = () => {
        return <div>{watch(state.foo)}</div>;
      }
    `;

    const transpiled = babel.transform(sourceCode, {
      plugins: ["@babel/plugin-syntax-jsx", { visitor: visitor(babel) }],
    }).code;

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state, watch } from "./src/model";
      export const MyComponent = model.connect(({
        state,
        watch
      }) => () => {
        return <div>{watch(state.foo)}</div>;
      }, "MyComponent");
    `);
  });

  it("can transpile an exported function expression component", () => {
    const sourceCode = `
      import { state, watch } from "./src/model";
      export const MyComponent = function () {
        return <div>{watch(state.foo)}</div>;
      }
    `;

    const transpiled = babel.transform(sourceCode, {
      plugins: ["@babel/plugin-syntax-jsx", { visitor: visitor(babel) }],
    }).code;

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state, watch } from "./src/model";
      export const MyComponent = model.connect(({
        state,
        watch
      }) => () => {
        return <div>{watch(state.foo)}</div>;
      }, "MyComponent");
    `);
  });

  it("can transpile an exported function declaration component", () => {
    const sourceCode = `
      import { state, watch } from "./src/model";
      export function MyComponent () {
        return <div>{watch(state.foo)}</div>;
      }
    `;

    const transpiled = babel.transform(sourceCode, {
      plugins: ["@babel/plugin-syntax-jsx", { visitor: visitor(babel) }],
    }).code;

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state, watch } from "./src/model";
      export const MyComponent = model.connect(({
        state,
        watch
      }) => () => {
        return <div>{watch(state.foo)}</div>;
      }, "MyComponent");
    `);
  });

  it("passes down the universe", () => {
    const sourceCode = `
      import { state, dispatch as d, watch } from "./src/model";
      import { anotherAction } from "./another";
      import * as React from "react";
      const MyComponent = () => {
        React.useEffect(() => {
          d(anotherAction)();
        }, []);
        return <div>{watch(state.foo)}</div>;
      }
    `;

    const transpiled = babel.transform(sourceCode, {
      plugins: ["@babel/plugin-syntax-jsx", { visitor: visitor(babel) }],
    }).code;

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state, dispatch as d, watch } from "./src/model";
      import { anotherAction } from "./another";
      import * as React from "react";
      const MyComponent = model.connect(({
        state,
        dispatch: d,
        watch
      }) => () => {
        React.useEffect(() => {
          d(anotherAction)();
        }, []);
        return <div>{watch(state.foo)}</div>;
      }, "MyComponent");
    `);
  });

  it("passes args", () => {
    const sourceCode = `
      import { state, watch } from "./src/model";
      const MyComponent = ({
        foo,
        bar
      }) => {
        return (
          <div>
            <div>{foo}</div>
            <div>{bar}</div>
            <div>{watch(state.foo)}</div>
          </div>
        );
      }
    `;

    const transpiled = babel.transform(sourceCode, {
      plugins: ["@babel/plugin-syntax-jsx", { visitor: visitor(babel) }],
    }).code;

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state, watch } from "./src/model";
      const MyComponent = model.connect(({
        state,
        watch
      }) => ({
        foo,
        bar
      }) => {
        return (
          <div>
            <div>{foo}</div>
            <div>{bar}</div>
            <div>{watch(state.foo)}</div>
          </div>
        );
      }, "MyComponent");
    `);
  });

  it("doesn't pass blacklisted imports from the model to the universe", () => {
    const sourceCode = `
      import { state, initState, watch } from "./src/model";
      const foo = initState.foo;
      const MyComponent = () => {
        return (
          <div>
            <div>{initState.foo}</div>
            <div>{watch(state.foo)}</div>
          </div>
        );
      }
    `;

    const transpiled = babel.transform(sourceCode, {
      plugins: ["@babel/plugin-syntax-jsx", { visitor: visitor(babel) }],
    }).code;

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state, initState, watch } from "./src/model";
      const foo = initState.foo;
      const MyComponent = model.connect(({
        state,
        watch
      }) => () => {
        return (
          <div>
            <div>{initState.foo}</div>
            <div>{watch(state.foo)}</div>
          </div>
        );
      }, "MyComponent");
    `);
  });

  it("can transpile multiple components", () => {
    const sourceCode = `
      import { state, watch } from "./src/model";
      const MyComponent = () => {
        return <div>{watch(state.foo)}</div>;
      };
      const MyOtherComponent = () => {
        return <div>{watch(state.bar)}</div>;
      };
    `;

    const transpiled = babel.transform(sourceCode, {
      plugins: ["@babel/plugin-syntax-jsx", { visitor: visitor(babel) }],
    }).code;

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state, watch } from "./src/model";
      const MyComponent = model.connect(({
        state,
        watch
      }) => () => {
        return <div>{watch(state.foo)}</div>;
      }, "MyComponent");
      const MyOtherComponent = model.connect(({
        state,
        watch
      }) => () => {
        return <div>{watch(state.bar)}</div>;
      }, "MyOtherComponent");
    `);
  });

  it("doesn't import the model if it's already imported", () => {
    const sourceCode = `
      import { model, state, watch } from "./src/model";
      const MyComponent = () => {
        return <div>{watch(state.foo)}</div>;
      };
    `;

    const transpiled = babel.transform(sourceCode, {
      plugins: ["@babel/plugin-syntax-jsx", { visitor: visitor(babel) }],
    }).code;

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state, watch } from "./src/model";
      const MyComponent = model.connect(({
        state,
        watch
      }) => () => {
        return <div>{watch(state.foo)}</div>;
      }, "MyComponent");
    `);
  });
});
