---
title: "Store"
order: 2
---

A store is your application's single source of truth. You can create a store from
your model with the [`createStore`](/api-reference/createStore) function. By default you only need to pass in
your app's initial state. However, you will also need to pass in any config
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
