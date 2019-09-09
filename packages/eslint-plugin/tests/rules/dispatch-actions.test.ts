import rule from "../../src/rules/require-dispatch-actions";
import { RuleTester } from "../ruleTester";

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
});

const messageId = "dispatchAction";

ruleTester.run("my-rule", rule, {
  valid: [
    {
      code: "var foo = true",
    },
  ],

  invalid: [
    {
      code: "var invalidVariable = true",
      errors: [{ messageId: "Must dispatch actions" }],
    },
    {
      code: "var invalidVariable = true",
      errors: [{ messageId: "Must dispatch actions" }],
    },
  ],
});
