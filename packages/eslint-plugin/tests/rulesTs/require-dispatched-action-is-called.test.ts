import rule from "../../src/rules/require-dispatched-action-is-called";
import { defaultTsFile, RuleTester } from "../ruleTester";

const ruleTester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
});
const messageId = "mustBeCalled";

ruleTester.run("require-dispatched-action-is-called", rule, {
  valid: [
    {
      code: `foo(bar)()`,
      filename: defaultTsFile,
    },
    {
      code: `dispatch(foo)`,
      filename: defaultTsFile,
    },
    {
      code: `[dispatch](foo)`,
      filename: defaultTsFile,
    },
    {
      code: `import * as model from "./model";
      dispatch(foo);`,
      filename: defaultTsFile,
    },
    {
      code: `import { dispatch } from "./model";
      const dispatch = () => {return;};
      dispatch(foo);`,
      filename: defaultTsFile,
    },
    {
      code: `import { dispatch } from "./model";
      const myDispatchToProps = (dispatch) => ({
        foo: () => dispatch(foo),
      });`,
      filename: defaultTsFile,
    },
    {
      code: `import {dispatch} from 'foo.ts'; dispatch(foo);`,
      filename: defaultTsFile,
    },
    {
      code: `import {dispatch} from '../../model.ts'; [dispatch](foo);`,
      filename: defaultTsFile,
    },
    {
      code: `import {dispatch} from '../../model.ctx.tsx'; dispatch(foo)();`,
      filename: defaultTsFile,
    },
  ],

  invalid: [
    {
      code: `import {dispatch} from '../../model.tsx'; dispatch(foo);`,
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
    {
      code: `import {dispatch} from './model.ctx.js'; dispatch(foo)[bar];`,
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
    {
      code: `import * as model from "./model";
      model.dispatch(foo);`,
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
    {
      code: `import * as model from "./model";
      foo(model.dispatch(foo));`,
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
    {
      code: `import {dispatch} from "./model";
      dispatch(dispatch(foo))();`,
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
  ],
});
