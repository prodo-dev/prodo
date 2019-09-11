---
title: "Model / Store"
order: 4
---

# Model

A model contains all types and plugins used in your application. To create a
model you just have to call `createModel` with your state type.

```ts
import { createModel } from "@prodo/core";

export interface State {
  count: number;
}

export const model = createModel<State>();
export const { state, watch, dispatch } = model.ctx;
```

You can also extend the model with [plugins](./plugins.md). You add plugins to
the model using the `.with` function.

```ts
import logger from "@prodo/logger"

// ...

export const model = createModel<State>().with(logger);
```

# Store

A store is your applications single source of truth. You can create a store from
your model with the `createStore` function. By default you only need to pass in
your apps initial state. However, you will also need to pass in any config
required by the plugins you are using.

```ts
import { model } from "./model";

const { store, Provider } = model.createStore({
  initState: {},
  // plugin config...
});
```

`createStore` returns your store and a [React
provider](https://reactjs.org/docs/context.html) you can use to wrap your app
in.

```tsx
const { store, Provider } = model.createStore({
  initState: {},
  // plugin config...
});

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById("root")
);
```
