<img src="https://user-images.githubusercontent.com/3044853/65060781-6d032d00-d970-11e9-9bb2-44c1811f80b5.png" height="100px" align="left"/>

# Prodo

[![CircleCI](https://circleci.com/gh/prodo-ai/prodo.svg?style=svg)](https://circleci.com/gh/prodo-ai/prodo) 
[![npm version](https://badge.fury.io/js/%40prodo%2Fcore.svg)](https://badge.fury.io/js/%40prodo%2Fcore)

Prodo is a React framework to write performant and scalable web
apps with as little boilerplate as possible.

[Documentation](https://prodo-docs.web.app)

## Key benefits

- Drastically simplified state management
- Absolute minimal boilerplate, especially compared to Redux
- Blazingly fast re-rendering, similar to MobX
- First class support for TypeScript
- Easily testable out of the box
- Less to learn and shorter ramp up time
- Powerful plugins for routing, local storage, authentication, database, and more...

## Show me the code

Define your model with types:

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

## Examples

There are many example apps that use prodo in `examples/`. You can run them by
navigating to the repo and running:

``` shell
yarn && yarn start
```

Open [localhost:1234](http://localhost:1234).

To typecheck and lint the example run `yarn lint`. Some of the examples also
have tests that can be run with `yarn test`.

## Architecture

This is a [monorepo](https://en.wikipedia.org/wiki/Monorepo). Published packages
are in `packages/`. Example apps that use the framework are in `examples/`.

## Developing

- Checkout this repo.
- Run `yarn` at the root.
- Run `yarn build:watch` to build all the TypeScript. Check this console for
  type errors.
- Fix linting errors with `yarn lint --fix`.
- To run a sanity check over everything, run `yarn verify`.

## Publishing

[lerna](https://github.com/lerna/lerna) is used to publish all packages at the
same time. To publish just run `lerna publish`.
