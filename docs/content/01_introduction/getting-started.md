---
title: "Getting Started"
order: 1
---

Prodo is a web framework that enables you to write performant and scalable web
apps with as little boilerplate as possible. It was designed with TypeScript in
mind and even includes a babel plugin to further reduce the amount of
boilerplate you write.

# Try Prodo

## Code Sandbox

_ToDo_

# Prodo Template

You can get started with Prodo by cloning the [template
project](https://github.com/prodo-ai/prodo-template). This template uses the
[Parcel](https://parceljs.org/) module bundler.

# Basic Example

This section will walk you through the main concepts of Prodo by creating a
simple "Counter" app. It assumes yo have basic knowledge of
[ES6](https://www.w3schools.com/js/js_es6.asp) and [React](https://reactjs.org).
The following example assumes you have cloned the starting template. All code
snippets use the babel plugin.

The typical workflow in developing a Prodo app is to

1. Create a model
2. Create actions that mutate the model
3. Create components that render the model

## Creating a Model

A [model](/basics/model) holds all of the types used in your actions and components. Create one
in a file called `src/model.ts`.

```ts
import { createModel } from "@prodo/core";

export interface State {
  count: number;
}

export const model = createModel<State>();
export const { state, watch, dispatch } = model.ctx;
```

Here we defined the type of our state in our app will be. In our case, it will just
contain a single `count` value. We then create our model with this state type
and export any variables from our model that are used elsewhere in our app.
These variables that are exported from our model are correctly typed with our
state.

## Creating an Action

[Actions](/basics/actions) are async functions that access the state or use a plugin. They can
take arguments, trigger side effects, and trigger other actions. We can create
an action in the `src/App.tsx` file.

```tsx
import { state, dispatch } from "./model";

const changeCount = (amount: number) => {
  state.count += amount;
};
```

This action just changes the count in our state by an amount. This action can
be triggered in a component or another action with the `dispatch` function.

```ts
dispatch(changeCount)(1);
```

## Creating a component

[Components](/basics/components) take the state of your application and render it as JSX. Prodo
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
};

const App = () => (
  <div>
    <button onClick={() => dispatch(changeCount)(-1)}>-</button>
    <h1>{watch(state.count)}</h1>
    <button onClick={() => dispatch(changeCount)(1)}>+</button>
  </div>
);

export default App;
```

## Creating the Store

When starting your app, you need to create a [store](/basics/store) with your
app's initial state. This is done in `src/index.tsx`.

```tsx
import { model } from "./model";

const store = model.createStore({
  initState: {
    count: 0,
  },
});
```

The [Provider](/api-reference) returned from
[`createStore`](/api-reference/createStore) is used to wrap your app which makes
the store accessible in all of your components.

```tsx
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { model } from "./model";

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
