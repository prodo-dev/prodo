---
title: "createModel"
order: 1
---

```ts
createModel<State>();
```

Creates a [`Model`](./model). Takes no parameters and is parameterized by your
app's `State`.

**Usage**

```ts
import { createModel } from "@prodo/core";

interface State {
  count: number;
}

export const model = createModel<State>();
```
