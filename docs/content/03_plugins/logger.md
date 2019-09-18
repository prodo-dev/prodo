---
title: "Logger"
order: 1
---

Output the result of all actions to the console.

## Installation

```shell
npm install --save @prodo/logger
```

## Add to your model

```ts
// src/model.ts
import logger from "@prodo/logger";

// ...

export const model = createModel<State>().with(logger);
```

## Config

Adds a single item to the `createStore` config.

- `logger` boolean that indicates whether or not logging is enabled. Defaults.
  to `false`.

```ts
const { Provider } = model.createStore({
  logger: true,
  initState: { /* ... */ }
});
```
