import rule from "../../src/rules/require-dispatched-action-is-called";
import { defaultTsxFile, RuleTester } from "../ruleTester";

const tsxRuleTester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
});

const messageId = "mustBeCalled";
tsxRuleTester.run("require-dispatched-action-is-called", rule, {
  valid: [
    {
      code: `import {dispatch} from './model.js'; <div onClick={() => dispatch(foo)()} />`,
      filename: defaultTsxFile,
    },
    {
      code: `<div onClick={() => dispatch(foo)} />`,
      filename: defaultTsxFile,
    },
  ],
  invalid: [
    {
      code: `import {dispatch} from './model.js'; <div onClick={() => dispatch(foo)} />`,
      errors: [{ messageId }],
      filename: defaultTsxFile,
    },
  ],
});
