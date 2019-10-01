import rule from "../../src/rules/actions";
import { defaultTsFile, RuleTester } from "../ruleTester";

const ruleTester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
});

const messageId = "awaitingAction";
ruleTester.run("no-action-await", rule, {
  valid: [
    {
      code: `import {state} from './model';
        const action = () => {
            state.x = "x";
        };`,
      filename: defaultTsFile,
    },
    {
      code: `import * as model from './model';
        const action = () => {
            model.state.x = "x";
        };`,
      filename: defaultTsFile,
    },
    {
      code: `import * as model from './model';
        function action(){
            model.state;
            await foo(bar)();
        };`,
      filename: defaultTsFile,
    },
    {
      code: `import * as model from './model';
        function action(){
            model.state;
            await dispatch(bar)();
        };`,
      filename: defaultTsFile,
    },
    {
      code: `import * as model from './model';
        const model = {};
        function notAnAction(){
            model.state;
            await model.dispatch(foo)();
        };`,
      filename: defaultTsFile,
    },
    {
      code: `import {dispatch} from './model'; 
          const action = async () => {
              await dispatch(foo)();
          };`,
      filename: defaultTsFile,
      options: [{ noAwait: false }],
    },
    {
      code: `import {dispatch} from './model'; 
          const action = async () => {
              await dispatch(foo)();
              return 1;
          };`,
      filename: defaultTsFile,
      options: [{ noAwait: false, noReturn: false }],
    },
  ],
  invalid: [
    {
      code: `import {dispatch} from './model'; 
          const action = async () => {
              await dispatch(foo)();
          };`,
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
    {
      code: `import {state, dispatch} from './model'; 
        const action = async () => {
            state.x = "x";
            await dispatch(foo)();
        };`,
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
    {
      code: `import {state, dispatch} from './model'; 
        const action = async () => {
            await dispatch(foo)();
            state.a = 1;
        };`,
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
    {
      code: `import * as model from './model'; 
            const action = async () => {
            model.state.a = 1;
            await model.dispatch(foo)();
        };`,
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
    {
      code: `import * as model from './model';
        const action = () => {
            const bar = async () => {
                model.state.b = 1;
                await model.dispatch(foo)();
            }
            bar();
        };`,
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
    {
      code: `import * as model from './model';
        function action(){
            model.state;
            await model.dispatch(foo)();
        };`,
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
    {
      code: `import {state, dispatch} from './model';
        {a: () => {
                state.x = "x";
                await dispatch(foo)();
            };
        }`,
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
    {
      code: `import * as model from './model';
        function notAnAction(){
            const model = {};
        }
        function action(){
            model.state;
            await model.dispatch(foo)();
        };`,
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
    {
      code: `import * as model from './model';
          const action = async () => {
              const insideFunction = async () => {
                  model.state.x = "x";
                  await model.dispatch(foo)();
              }
              await insideFunction()
          };`,
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
    {
      code: `import {dispatch} from './model'; 
          const action = async () => {
              await dispatch(foo)();
              return 1;
          };`,
      filename: defaultTsFile,
      errors: [{ messageId }],
      options: [{ noReturn: false, noAwait: true }],
    },
  ],
});
