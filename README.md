<img src="https://user-images.githubusercontent.com/3044853/65060781-6d032d00-d970-11e9-9bb2-44c1811f80b5.png" height="90px" align="left"/>

# Prodo

Prodo is a React framework to write performant and scalable web
apps with as little boilerplate as possible. View the [Documentation](https://prodo-docs.web.app).

[![CircleCI](https://circleci.com/gh/prodo-ai/prodo.svg?style=svg)](https://circleci.com/gh/prodo-ai/prodo)
[![npm version](https://img.shields.io/npm/v/%40prodo%2Fcore.svg?style=flat-square&color=brightgreen)](https://www.npmjs.com/package/@prodo/core)

## Key benefits

- 🎉 Drastically simplified state management
- ✨ Absolutely minimal boilerplate, especially compared to Redux
- ⚡️ Blazingly fast re-rendering, similar to MobX
- 👯‍♀️ Handles async actions out of the box
- 🔎 First class support for TypeScript
- ✅ Easily testable
- 🚀 Less to learn and shorter ramp up time
- 💪 Powerful plugins for routing, local storage, authentication, database, and more...

## Show me the code

Define your model:

```tsx
// src/model.ts
import { createModel } from "@prodo/core";

interface State {
  count: number;
}

export const model = createModel<State>();
export const { state, watch, dispatch } = model.ctx;
```

Use your state:

```tsx
// src/index.tsx
import { model, state, dispatch, watch } from "./model";

const changeCount = (amount: number) => {
  state.count += amount;
};

const App = () => (
  <div>
    <button onClick={() => dispatch(changeCount)(-1)}>-</button>
    <h1>Count: {watch(state.count)}</h1>
    <button onClick={() => dispatch(changeCount)(1)}>+</button>
  </div>
);

const { Provider } = model.createStore({
  initState: {
    count: 0,
  },
});

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById("root"),
);
```

As you can see in the above example, the state type was used once and
everything else is automatically inferred.

## Examples

There are many example apps that use Prodo in `examples/`. We recommend looking at

- Small to-do app example: [`examples/todo-app`](/examples/todo-app)
- Larger kanban app example: [`examples/kanban`](/examples/kanban)

### Running an example

Navigate to the example directory. For example:

```shell
cd examples/todo-app
```

Install dependencies

```shell
yarn
```

Run development server

```shell
yarn start
```

Navigate to [localhost:1234](http://localhost:1234).

Some examples have tests. You can run the tests with

```shell
yarn test
```
