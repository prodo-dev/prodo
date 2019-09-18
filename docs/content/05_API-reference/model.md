---
title: "Model"
order: 3
---

```ts
interface Model<InitOptions, Universe, ActionCtx, ViewCtx>;
```

Stores all types and plugins used in your app. Created with
[`createModel`](./createModel).

**Example**

```ts
const model = createModel<State>();
```


## Methods

```
with(plugin)
```

Adds a plugin to the model. Returns a new model.

**Usage**

```ts
import { createModel } from "@prodo/core";
import logger from "@prodo/logger";


const model = createModel<State>().with(logger);
```

---

```ts
createStore(config)
```

Create a [`Store`](./store) and [`Provider`](./provider). Takes in initial state
and all config needed for plugin.

**Usage**

```ts
import { model } from "./model";

const { store, Provider } = model.createStore({
  initState: {
    count: 0
  }
});
```
