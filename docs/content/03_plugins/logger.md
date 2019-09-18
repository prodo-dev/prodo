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
import loggerPlugin from "@prodo/logger";

// ...

export const model = createModel<State>().with(loggerPlugin);
```

## Config

Items added to the `createStore` config.

```ts
export interface LoggerConfig {
  logger?: boolean;
}
```

`logger`

boolean that indicates whether or not logging is enabled. Defaults to `false`.

```ts
const { Provider } = model.createStore({
  logger: true,
  initState: {
    /* ... */
  },
});
```
