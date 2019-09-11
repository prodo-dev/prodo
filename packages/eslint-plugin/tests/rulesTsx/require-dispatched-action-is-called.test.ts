import rule from "../../src/rules/require-provider";
import { defaultTsxFile, RuleTester } from "../ruleTester";

const tsxRuleTester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
});

const messageId = "missingProvider";
tsxRuleTester.run("my-rule", rule, {
  valid: [
    {
      code: `<button className="btn"></button>`,
      filename: defaultTsxFile,
    },
  ],

  invalid: [
    {
      code: `<div>{dispatch(foo)}</div>`,
      errors: [{ messageId }],
      filename: defaultTsxFile,
    },
  ],
});
