import rule from "../../src/rules/require-dispatched-action-is-called";
import { defaultTsxFile, RuleTester } from "../ruleTester";

const tsxRuleTester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
});

const messageId = "mustBeCalled";
tsxRuleTester.run("my-rule", rule, {
  valid: [
    {
      code: `<button className="btn"></button>`,
      filename: defaultTsxFile,
    },
    {
      code: `<button className="btn" onClick={()=>{dispatch(foo)()}}></button>`,
      filename: defaultTsxFile,
    },
    {
      code: `<div>{dispatch(foo)()}</div>`,
      filename: defaultTsxFile,
    },
  ],

  invalid: [
    {
      code: `<div>{dispatch(foo)}</div>`,
      errors: [{ messageId }],
      filename: defaultTsxFile,
    },
    {
      code: `<button className="btn" onClick={dispatch(foo)}></button>`,
      errors: [{ messageId }],
      filename: defaultTsxFile,
    },
  ],
});
