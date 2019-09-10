---
title: "Getting Started"
order: 2
---

Prodo is a web framework that enables you to quickly write performant and
scalable web apps with a simple syntax. The main concepts of Prodo are,

- Flux architecture pattern
- Minimal boilerplate
- TypeScript first

The [flux architecture pattern](https://facebook.github.io/flux/) is used to
update your React components by dispatching actions with unidirectional data
flow.

A babel plugin is provided that automatically adds the glue needed to connect
the code you write to valid JavaScript that will run in the browser.

Prodo is developed in TypeScript and will always be TypeScript first.

# Try Prodo

## Code Sandbox

_ToDo_

## Installation

Prodo is available on [NPM](https://www.npmjs.com/package/@prodo/core). The main
framework is `@prodo/core`.

**NPM**

```shell
npm install --save @prodo/core
```

**Yarn**

```shell
yarn add @prodo/core
```

# Creating a new Project

You can get started with Prodo by cloning the [template
project](https://github.com/prodo-ai/prodo-template).

# Hello World

This section will walk you through the main concepts of Prodo by creating a
simple "Counter" app. It assumes yo have basic knowledge of
[ES6](https://www.w3schools.com/js/js_es6.asp) and [React](https://reactjs.org).
The following example assumes you have cloned the starting template. All code
snippets use the babel plugin.

The typical workflow in developing a Prodo app is too

1. Create a model
2. Create actions that mutate the model
3. Create components that render the model

## Creating a model

A model holds all of the types used in your actions and components. Create one
in a file called `src/model.ts`.

```ts
import { createModel } from "@prodo/core";

export interface State {
  count: number
}

export const model = createModel<State>();
export const { state, watch, dispatch } = model.ctx;
```

Here we defined the type our state in our app will be. In our case, it will just
contain a single `count` value. We then create our model with this state type
and export any variables from our model that are used elsewhere in our app.
These variables that are exported from our model are correctly typed with our
state.

## Creating and action

Actions are async functions that may change the state of your application. They can
take arguments, trigger side effects, and trigger other actions. We can create
an action in the `src/App.tsx` file.

```tsx
import { state, dispatch } from "./model";

const changeCount = (amount: number) => {
  state.count += amount;
} 
```

This action just changes the count in our state by an amount. This action can
be triggered in a component or another action with the `dispatch` function.

```ts
dispatch(changeCount)(1);
```

## Creating a component

Components take the state of your application and render it as JSX. Prodo
components are defined in the same way to React components. However, the
component can "subscribe" to part of the apps state. Whenever this state
changes, the component will re-render. Prodo performs optimizations behind the
scenes to ensure your component is only re-rendered when necessary.

```tsx
import { state, watch } from "./model";

const App = () => (
  <div>
    <h1>{watch(state.count)}</h1>
  </div>
);
```

Here we simply show the the `state.count` value.

Components can also trigger actions. Lets create two buttons to increment and
decrement the counter using the action we defined above.

```tsx
import { state, dispatch, watch } from "./model";

const App = () => (
  <div>
    <button onClick={() => dispatch(changeCount)(-1)}>-</button>
    <h1>{watch(state.count)}</h1>
    <button onClick={() => dispatch(changeCount)(1)}>+</button>
  </div>
);
```

After the above change the full `src/App.tsx` file is,

```tsx
import * as React from "react";
import { state, dispatch, watch } from "./model";

const changeCount = (amount: number) => {
  state.count += amount;
} 

const App = () => (
  <div>
    <button onClick={() => dispatch(changeCount)(-1)}>-</button>
    <h1>{watch(state.count)}</h1>
    <button onClick={() => dispatch(changeCount)(1)}>+</button>
  </div>
);

export default App;
```

## Creating the store

When starting your app, you need to provide an initial state. This is done in
`src/index.tsx`.

```tsx
import { model } from "./model";

const store = model.createStore({
  initState: {
    count: 0,
  },
});
```

This store is then passed to the `ProdoProvider`, which makes it accessible in
to all of your components.

```tsx
import { ProdoProvider } from "@prodo/core";
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { model } from "./model";

const store = model.createStore({
  initState: {
    count: 0,
  },
});

ReactDOM.render(
  <ProdoProvider value={store}>
    <App />
  </ProdoProvider>,
  document.getElementById("root"),
);
```
