---
title: "Model"
order: 1
---

A model contains all types and plugins used in your application. To create a
model, call `createModel` with `State` as a type parameter.

```ts
import { createModel } from "@prodo/core";

export interface State {
  count: number;
}

export const model = createModel<State>();
export const { state, watch, dispatch } = model.ctx;
```

You can also extend the model with [plugins](./plugins). You add plugins to
the model using the `.with` function.

```ts
import logger from "@prodo/logger";

// ...

export const model = createModel<State>().with(logger);
```
