import rule from "../../src/rules/require-dispatch-actions";
import { getFixturesRootDir, RuleTester } from "../ruleTester";

const messageId = "dispatch";

const rootDir = getFixturesRootDir();
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    tsconfigRootDir: rootDir,
    project: "./tsconfig.json",
  },
  parser: "@typescript-eslint/parser",
});

ruleTester.run("my-rule", rule, {
  valid: [
    {
      code: "foo[bar]",
    },
  ],

  invalid: [
    {
      code: "foo(bar)",
      errors: [{ messageId }],
    },
  ],
});
