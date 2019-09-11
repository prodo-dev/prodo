import rule from "../../src/rules/require-dispatch-actions";
import { defaultTsFile, RuleTester } from "../ruleTester";

const ruleTester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
});

const messageId = "dispatch";

ruleTester.run("my-rule", rule, {
  valid: [
    {
      code: "foo[bar]",
      filename: defaultTsFile,
    },
  ],

  invalid: [
    {
      code: "type Action = ()=>void; const foo:Action = ()=>{}; foo(bar)",
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
    {
      code: "import {action} from './actions'; action(something)",
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
  ],
});
