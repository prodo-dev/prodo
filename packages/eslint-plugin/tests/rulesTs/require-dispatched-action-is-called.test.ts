import rule from "../../src/rules/require-dispatched-action-is-called";
import { defaultTsFile, RuleTester } from "../ruleTester";

const ruleTester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
});
const messageId = "mustBeCalled";

ruleTester.run("my-rule", rule, {
  valid: [
    {
      code: `foo(bar)()`,
      filename: defaultTsFile,
    },
    {
      code: `foo`,
      filename: defaultTsFile,
    },
    {
      code: `foo()`,
      filename: defaultTsFile,
    },
    {
      code: `dispatch(foo)()`,
      filename: defaultTsFile,
    },
    {
      code: `dispatch(foo)(bar)`,
      filename: defaultTsFile,
    },
    {
      code: `[dispatch](foo)`,
      filename: defaultTsFile,
    },
  ],

  invalid: [
    {
      code: `dispatch(foo)`,
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
    {
      code: `dispatch(foo)[bar]`,
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
  ],
});
