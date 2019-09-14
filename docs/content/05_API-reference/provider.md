---
title: "Provider"
order: 5
---

[React context](https://reactjs.org/docs/context.html) provider used to expose a
[`Store`](./store) to all components in your app.

**Usage**

```tsx
import App from "./App";
import { model } from "./model";

const { Provider } = model.createStore({
  initState: {
    count: 0
  }
});

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById("root"),
);
```
