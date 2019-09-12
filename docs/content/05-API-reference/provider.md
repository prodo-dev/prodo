---
title: "Provider"
order: 5
---

Wrap your app with a Prodo [context](https://reactjs.org/docs/context.html).

Takes in the [`Store`](./store) as the `value` prop.

**Usage**

```tsx
import App from "./App";
import { model } from "./model";

const { store, Provider } = model.createStore({
  initState: {
    count: 0
  }
});

ReactDOM.render(
  <ProdoProvider value={store}>
    <App />
  </ProdoProvider>,
  document.getElementById("root"),
);
```
