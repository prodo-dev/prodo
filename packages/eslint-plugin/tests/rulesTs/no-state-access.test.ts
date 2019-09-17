import rule from "../../src/rules/no-state-access";
import { defaultTsFile, RuleTester } from "../ruleTester";

const ruleTester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
});

const messageId = "accessingState";
ruleTester.run("no-state-access", rule, {
  valid: [
    {
      code: `const state = 1;`,
      filename: defaultTsFile,
    },
    {
      code: `const foo = state;`,
      filename: defaultTsFile,
    },
    {
      code: `import {state, foo} from './model';
      console.log(foo)`,
      filename: defaultTsFile,
    },
    {
      code: `import {state} from './model';
      const foo = (state)=>{return state}`,
      filename: defaultTsFile,
    },
    {
      code: `import {state} from './model';
      const state = 1;
      state;`,
      filename: defaultTsFile,
    },
    {
      code: `import * as model from './model';
      const state = 1;
      state;`,
      filename: defaultTsFile,
    },
    {
      code: `import * as model from './model';
      model.dispatch(foo)();`,
      filename: defaultTsFile,
    },
    {
      code: `import {state, foo} from './model'; 
        const x = 1;
        foo(x); 
        const bar = (param)=>{
            const value = foo(y); 
            try{
                return param + state;
            }
            catch (e){
                return param;
            }
            }; 
        function foo(state){return state}`,
      filename: defaultTsFile,
    },
  ],
  invalid: [
    {
      code: `import {state, foo} from './model'; 
      const a = state;`,
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
    {
      code: `import {state, foo} from './model'; 
      state.a = a;`,
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
    {
      code: `import {state, foo} from './model';
      console.log(state)`,
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
    {
      code: `import * as model from './model';
      model.state;`,
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
    {
      code: `import {state, foo} from './model';
      try{
        foo(state)
      }
      catch (e){
        console.log(e)
      }`,
      errors: [{ messageId }],
      filename: defaultTsFile,
    },
  ],
});
