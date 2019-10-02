import * as babel from "@babel/core";
import visitor from "../src/components-and-actions";

import "./setup";

const transform = (sourceCode: string, filename?: string): string =>
  babel.transform(sourceCode, {
    plugins: [{ visitor: visitor(babel) }],
    filename,
  })!.code!;

describe("transpilation", () => {
  it("doesn't transpile things that don't use the context", () => {
    const sourceCode = `
      const foo = () => {
        return "foo";
      };
    `;

    const transpiled = transform(sourceCode, "src/file.ts");

    expect(transpiled).toHaveTheSameASTAs(sourceCode);
  });

  it("doesn't transpile stuff that only uses the model", () => {
    const sourceCode = `
      import { model } from "./model";
      const notAnAction = () => {
        model.createStore({});
      };
  `;

    const transpiled = transform(sourceCode, "src/My-Component.tsx");

    expect(transpiled).toHaveTheSameASTAs(sourceCode);
  });

  it("doesn't transpile stuff that only uses the model via a require", () => {
    const sourceCode = `
      const { model } = require("./model");
      const notAnAction = () => {
        model.createStore({});
      };
  `;

    const transpiled = transform(sourceCode, "src/My-Component.tsx");

    expect(transpiled).toHaveTheSameASTAs(sourceCode);
  });

  // Not yet supported
  it.skip("doesn't transpile stuff that only uses the model", () => {
    const sourceCode = `
      import prodo from "./model";
      const notAnAction = () => {
        prodo.model.createStore({});
      };
  `;

    const transpiled = transform(sourceCode, "src/My-Component.tsx");

    expect(transpiled).toHaveTheSameASTAs(sourceCode);
  });
});
