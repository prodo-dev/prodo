import rule from "../../src/rules/actions";
import { defaultTsFile, RuleTester } from "../ruleTester";

const ruleTester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
});

const messageId = "returningValue";
ruleTester.run("no-action-return", rule, {
  valid: [
    {
      code: `import {state} from './model';
      const action = ()=>{
          state.a = 1;
      };`,
      filename: defaultTsFile,
    },
    {
      code: `import {state} from './model';
        function action(){
            state.a = 1;
        };`,
      filename: defaultTsFile,
    },
    {
      code: `import {state} from './model';
        {a: ()=>{
              state.a = 1;
          };}`,
      filename: defaultTsFile,
    },
    {
      code: `import {foo} from './model';
        const action = ()=>{
            foo.a = 1;
        };`,
      filename: defaultTsFile,
    },
    {
      code: `import * as model from './model';
        const model = {};
        function foo(){
            model.state;
            return 1;
        };`,
      filename: defaultTsFile,
    },
    {
      code: `import * as model from './model';
          const action = ()=>{
              model.state.a = 1;
          };`,
      filename: defaultTsFile,
    },
    {
      code: `import * as model from './model';
            const action = ()=>{
                const insideFunction = () => {
                    model.state.b = 1;
                    return 'hello';
                }
                model.state.a = 1;
            };`,
      filename: defaultTsFile,
    },
    {
      code: `import {state, foo} from './model'; 
      const action = ()=>{
        state.a = 1;
        return 'hello'
      };`,
      filename: defaultTsFile,
      options: [{ noReturn: false }],
    },
    {
      code: `import {state, foo, dispatch} from './model'; 
      const action = ()=>{
        state.a = 1;
        await dispatch(foo)()
        return 'hello'
      };`,
      filename: defaultTsFile,
      options: [{ noReturn: false, noAwait: false }],
    },
  ],
  invalid: [
    {
      code: `import {state, foo} from './model'; 
      const action = ()=>{
        state.a = 1;
        return 'hello'
      };`,
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
    {
      code: `import * as model from './model';
      const foo = ()=>{
        const bar = () => {
            model.state.b = 1;
            return 'hello';
        }
        return 1;
      };`,
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
    {
      code: `import * as model from './model';
        function foo(){
            model.state;
            return 1;
        };`,
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
    {
      code: `import {state} from './model';
        {a: () => {
              state.a = 1;
              return 1;
          };}`,
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
    {
      code: `import {state} from './model';
        const foo = () => {
                state.a = 1;
                return state;
            };`,
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
    {
      code: `import * as model from './model';
        function bar(){
            const model = {};
        }
        function foo(){
            model.state;
            return 1;
        };`,
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
    {
      code: `import {state, foo, dispatch} from './model'; 
      const action = ()=>{
        state.a = 1;
        await dispatch(foo)();
        return 'hello'
      };`,
      errors: [{ messageId }],
      filename: defaultTsFile,
      options: [{ noAwait: false, noReturn: true }],
    },
  ],
});
