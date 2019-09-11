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

  it("doesn't transpile something that doesn't use the universe", () => {
    const sourceCode = `
      import { initState } from "./src/model";
      const state = {
        foo: "foo"
      };

      const MyComponent = () => (
        <div>
          <div>{initState.foo}</div>
          <div>{state.foo}</div>
        </div>
      );
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(sourceCode);
  });

  it("can transpile a function expression component as long as the file name is present", () => {
    const sourceCode = `
      import { state, watch } from "./src/model.ctx";
      const MyComponent = function () {
        return <div>{watch(state.foo)}</div>;
      }
    `;

    const transpiled = transform(sourceCode, "Something.jsx");

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      import { state, watch } from "./src/model.ctx";
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
      import { state, watch } from "./src/model.ctx";
      function MyComponent () {
        return <div>{watch(state.foo)}</div>;
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      import { state, watch } from "./src/model.ctx";
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
      import * as prodo from "./src/model.ctx";
      const MyComponent = () => {
        return <div>{prodo.watch(prodo.state.foo)}</div>;
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      import * as prodo from "./src/model.ctx";
      const MyComponent = model.connect(prodo => () => {
        return <div>{prodo.watch(prodo.state.foo)}</div>;
      }, "MyComponent");
    `);
  });

  it("can transpile a component that renames the import", () => {
    const sourceCode = `
      import { state as s, watch as w } from "./src/model.ctx";
      const MyComponent = () => {
        return <div>{w(s.foo)}</div>
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      import { state as s, watch as w } from "./src/model.ctx";
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
      const prodo = require("./src/model.ctx");
      const MyComponent = () => {
        return <div>{prodo.watch(prodo.state.foo)}</div>;
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      const prodo = require("./src/model.ctx");
      const MyComponent = model.connect(prodo => () => {
        return <div>{prodo.watch(prodo.state.foo)}</div>;
      }, "MyComponent");
    `);
  });

  it("can transpile an action that uses require syntax with spread", () => {
    const sourceCode = `
      const { state, watch } = require("./src/model.ctx");
      const MyComponent = () => {
        return <div>{watch(state.foo)}</div>;
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      const { state, watch } = require("./src/model.ctx");
      const MyComponent = model.connect(({ state, watch }) => () => {
        return <div>{watch(state.foo)}</div>;
      }, "MyComponent");
    `);
  });

  it("can transpile an exported arrow function expression component", () => {
    const sourceCode = `
      import { state, watch } from "./src/model.ctx";
      export const MyComponent = () => {
        return <div>{watch(state.foo)}</div>;
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      import { state, watch } from "./src/model.ctx";
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
      import { state, watch } from "./src/model.ctx";
      export const MyComponent = function () {
        return <div>{watch(state.foo)}</div>;
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      import { state, watch } from "./src/model.ctx";
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
      import { state, watch } from "./src/model.ctx";
      export function MyComponent () {
        return <div>{watch(state.foo)}</div>;
      }
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      import { state, watch } from "./src/model.ctx";
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
      import { dispatch as d, state, watch } from "./src/model.ctx";
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
      import { model } from "./src/model";
      import { dispatch as d, state, watch } from "./src/model.ctx";
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
      import { state, watch } from "./src/model.ctx";
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
      import { model } from "./src/model";
      import { state, watch } from "./src/model.ctx";
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
      import { state, watch } from "./src/model.ctx";
      const MyComponent = () => {
        return <div>{watch(state.foo)}</div>;
      };
      const MyOtherComponent = () => {
        return <div>{watch(state.bar)}</div>;
      };
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      import { state, watch } from "./src/model.ctx";
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
      import { model } from "./src/model";
      import { state, watch } from "./src/model.ctx";
      const MyComponent = () => {
        return <div>{watch(state.foo)}</div>;
      };
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      import { state, watch } from "./src/model.ctx";
      const MyComponent = model.connect(({
        state,
        watch
      }) => () => {
        return <div>{watch(state.foo)}</div>;
      }, "MyComponent");
    `);
  });

  it("doesn't crash on undefined identifiers", () => {
    const sourceCode = `
      import { state, watch } from "./src/model.ctx";
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
      import { model } from "./src/model";
      import { state, watch } from "./src/model.ctx";
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
      import { state, watch } from "./src/model.ctx";
      exports.MyComponent = () => {
        return <div>{watch(state.foo)}</div>;
      };
    `;

    const transpiled = transform(sourceCode);

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      import { state, watch } from "./src/model.ctx";
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
      import { state, watch } from "./src/model.ctx";
      export default () => {
        return <div>{watch(state.foo)}</div>;
      };
    `;

    const transpiled = transform(sourceCode, "Component.tsx");

    expect(transpiled).toHaveTheSameASTAs(`
      import { model } from "./src/model";
      import { state, watch } from "./src/model.ctx";
      export default model.connect(({
        state,
        watch
      }) => () => {
        return <div>{watch(state.foo)}</div>;
      }, "Default");
    `);
  });
});
