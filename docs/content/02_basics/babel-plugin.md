---
title: "Babel Plugin"
order: 7
---

Prodo's babel plugin is used to create components and actions using a more concise syntax.

# Installation

To install the babel plugin, install the package `@prodo/babel-plugin` as a dev-depenedency:

```bash
npm install --save-dev @prodo/babel-plugin
# or
yarn install --dev @prodo/babel-plugin
```

# Configuration

Before you use the babel plugin, you will need to ensure that you are using Babel to transpile your code. If you are using webpack, this can be done by passing your code to the [`babel-loader`](https://www.npmjs.com/package/babel-loader). If you are using Parcel, your code will be transpiled by Babel automatically, so you do not need to do anything.

Once you have ensured that you are using parcel, you will need to configure Babel to include the babel plugin. This is done by adding `"@prodo"` to the list of plugins used by Babel, usually defined in a file called _.babelrc_.

```json
{
  // ...
  "plugins": [
    // ...
    "@prodo"
  ]
}
```

You can also use the full name, `"@prodo/babel-plugin"`.

## Testing

When running your tests, you will also need to ensure that your test-runner is using babel to transpile your code before running your tests. For example, if you are using [Jest](https://jestjs.io) you will need to transform your code with `babel-jest` by adding a property to your _package.json_ file:

```json
{
  // ...
  "jest": {
    "transform": {
      "^.+\\.[jt]sx?$": "babel-jest"
    }
  }
}
```

You will need to install `babel-jest` as a dev-dependency.

If you are using TypeScript, you will need to ensure that Babel transpiles your TypeScript syntax as well, since `ts-jest` does not use Babel. This can be done by installing `@babel/preset-typescript` as a dev-dependency and adding it to the list of presets in your Babel configuration:

```json
{
  // ...
  "presets": [
    // ...
    "@babel/preset-typescript"
  ]
}
```

If you are not using Jest, please consult the documentation for your specific test-runner.

# Syntax

When using the Babel plugin, you can omit the calls to `model.action` and `model.connect` and instead write actions and components that import context from your model directly.

In order for this to work, your model must be defined in a model called _model.js_ (or _model.ts_) and all of your model's context (such as `state` and `dispatch`) must be exported from the same file, or a file in the same directory called _model.ctx.js_ (or _model.ctx.ts_).

## Actions

To write an action using the Babel plugin, simply import the various parts of your model's context and use them as normal. Note that an action's name must begin with a lowercase letter.

For example:

```tsx
import { state } from "./model";

export const increment = (amount: number) => {
  state.count += amount;
};
```

is transpiled to:

```tsx
import { model } from "./model";

export const increment = model.action(
  ({ state }) => (amount: number) => {
    state.count += amount;
  },
  "increment",
);
```

## Component

You can write a component in the same way, except the component's name must begin with an uppercase letter:

For example:

```tsx
import { state, watch } from "./model";

export const Counter = props => (
  <div>
    <span>Hello, {watch(state.count)}!</span>
  </div>
);
```

is transpiled to:

```tsx
import { model } from "./model";

export const Counter = model.connect(
  ({state}) => props => (
    <div>
      <span>Hello, {watch(state.count)}!</span>
    </div>;
  ),
  "Counter"
);
```
