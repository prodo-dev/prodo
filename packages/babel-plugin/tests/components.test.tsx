import * as babel from "@babel/core";
import visitor from "../src/components-and-actions";

import "./setup";

const transform = (sourceCode: string, filename?: string): string =>
  babel.transform(sourceCode, {
    plugins: ["@babel/plugin-syntax-jsx", { visitor: visitor(babel) }],
    filename,
  })!.code!;

describe("component transpilation", () => {
  it("can transpile an arrow function component", () => {
    const sourceCode = `
      import { state, watch } from "./src/model";
      const MyComponent = () => (
        <div>{watch(state.foo)}</div>
      );
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state, watch } from "./src/model";
      const MyComponent = model.connect(
        ({ state, watch }) => () => <div>{watch(state.foo)}</div>,
        "MyComponent"
      )
    `);
  });

  it("can detect the universe from model.ctx files", () => {
    const sourceCode = `
      import { state, watch } from "./src/model.ctx";
      const MyComponent = () => (
        <div>{watch(state.foo)}</div>
      );
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      import { state, watch } from "./src/model.ctx";
      const MyComponent = model.connect(
        ({ state, watch }) => () => <div>{watch(state.foo)}</div>,
        "MyComponent"
      )
    `);
  });

  it("can detect the universe from explicit js files", () => {
    const sourceCode = `
      import { state, watch } from "./src/model.js";
      const MyComponent = () => (
        <div>{watch(state.foo)}</div>
      );
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state, watch } from "./src/model.js";
      const MyComponent = model.connect(
        ({ state, watch }) => () => <div>{watch(state.foo)}</div>,
        "MyComponent"
      )
    `);
  });

  it("can detect the universe from explicit ts files", () => {
    const sourceCode = `
      import { state, watch } from "./src/model.ts";
      const MyComponent = () => (
        <div>{watch(state.foo)}</div>
      );
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state, watch } from "./src/model.ts";
      const MyComponent = model.connect(
        ({ state, watch }) => () => <div>{watch(state.foo)}</div>,
        "MyComponent"
      )
    `);
  });

  it("can transpile a function expression component as long as the file name is present", () => {
    const sourceCode = `
      import { state, watch } from "./src/model";
      const MyComponent = function () {
        return <div>{watch(state.foo)}</div>;
      }
    `;

    const transpiled = transform(sourceCode, "Something.jsx");

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state, watch } from "./src/model";
      const MyComponent = model.connect(({
        state,
        watch
      }) => function () {
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

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state, watch } from "./src/model";
      const MyComponent = model.connect(({
        state,
        watch
      }) => function MyComponent () {
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

    const transpiled = transform(sourceCode);

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

    const transpiled = transform(sourceCode);

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

  it("can transpile an action that uses require syntax", () => {
    const sourceCode = `
      const prodo = require("./src/model");
      const MyComponent = () => {
        return <div>{prodo.watch(prodo.state.foo)}</div>;
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      const prodo = require("./src/model");
      const MyComponent = model.connect(prodo => () => {
        return <div>{prodo.watch(prodo.state.foo)}</div>;
      }, "MyComponent");
    `);
  });

  it("can transpile an action that uses require syntax with spread", () => {
    const sourceCode = `
      const { state, watch } = require("./src/model");
      const MyComponent = () => {
        return <div>{watch(state.foo)}</div>;
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      const { state, watch } = require("./src/model");
      const MyComponent = model.connect(({ state, watch }) => () => {
        return <div>{watch(state.foo)}</div>;
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

    const transpiled = transform(sourceCode);

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

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state, watch } from "./src/model";
      export const MyComponent = model.connect(({
        state,
        watch
      }) => function () {
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

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state, watch } from "./src/model";
      export const MyComponent = model.connect(({
        state,
        watch
      }) => function MyComponent () {
        return <div>{watch(state.foo)}</div>;
      }, "MyComponent");
    `);
  });

  it("passes down the universe", () => {
    const sourceCode = `
      import { dispatch as d, state, watch } from "./src/model";
      import { anotherAction } from "./another";
      import * as React from "react";
      const MyComponent = () => {
        React.useEffect(() => {
          d(anotherAction)();
        }, []);
        return <div>{watch(state.foo)}</div>;
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, dispatch as d, state, watch } from "./src/model";
      import { anotherAction } from "./another";
      import * as React from "react";
      const MyComponent = model.connect(({
        dispatch: d,
        state,
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

    const transpiled = transform(sourceCode);

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

    const transpiled = transform(sourceCode);

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

    const transpiled = transform(sourceCode);

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

  it("doesn't import the model if it's already imported under another name", () => {
    const sourceCode = `
      import { model as m, state, watch } from "./src/model";
      const MyComponent = () => {
        return <div>{watch(state.foo)}</div>;
      };
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model as m, state, watch } from "./src/model";
      const MyComponent = m.connect(({
        state,
        watch
      }) => () => {
        return <div>{watch(state.foo)}</div>;
      }, "MyComponent");
    `);
  });

  it("doesn't crash on undefined identifiers", () => {
    const sourceCode = `
      import { state, watch } from "./src/model";
      const MyComponent = () => {
        return (
          <div>
            <div>{watch(state.foo)}</div>
            <div>{foo}</div>
          </div>
        );
      };
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state, watch } from "./src/model";
      const MyComponent = model.connect(({
        state,
        watch
      }) => () => {
        return (
          <div>
            <div>{watch(state.foo)}</div>
            <div>{foo}</div>
          </div>
        );
      }, "MyComponent");
    `);
  });

  it("compiles commonjs export syntax", () => {
    const sourceCode = `
      import { state, watch } from "./src/model";
      exports.MyComponent = () => {
        return <div>{watch(state.foo)}</div>;
      };
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state, watch } from "./src/model";
      exports.MyComponent = model.connect(({
        state,
        watch
      }) => () => {
        return <div>{watch(state.foo)}</div>;
      }, "MyComponent");
    `);
  });

  it("compiles default exports", () => {
    const sourceCode = `
      import { state, watch } from "./src/model";
      export default () => {
        return <div>{watch(state.foo)}</div>;
      };
    `;

    const transpiled = transform(sourceCode, "src/Component.tsx");

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state, watch } from "./src/model";
      export default model.connect(({
        state,
        watch
      }) => () => {
        return <div>{watch(state.foo)}</div>;
      }, "Component");
    `);
  });

  it("compiles default exports inside index files", () => {
    const sourceCode = `
      import { state, watch } from "./src/model";
      export default () => {
        return <div>{watch(state.foo)}</div>;
      };
    `;

    const transpiled = transform(sourceCode, "src/Component/index.tsx");

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state, watch } from "./src/model";
      export default model.connect(({
        state,
        watch
      }) => () => {
        return <div>{watch(state.foo)}</div>;
      }, "Component");
    `);
  });

  it("removes special characters when compiling default exports", () => {
    const sourceCode = `
      import { state, watch } from "./src/model";
      export default () => {
        return <div>{watch(state.foo)}</div>;
      };
    `;

    const transpiled = transform(sourceCode, "src/My-Component.tsx");

    expect(transpiled).toHaveTheSameASTAs(`
      import { model, state, watch } from "./src/model";
      export default model.connect(({
        state,
        watch
      }) => () => {
        return <div>{watch(state.foo)}</div>;
      }, "MyComponent");
    `);
  });
});
