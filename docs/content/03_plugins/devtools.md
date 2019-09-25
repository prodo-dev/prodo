---
title: "DevTools"
order: 7
---

Adds the prodo developer tools to your application.

## Installation

```shell
npm install --save @prodo/devtools-plugin
```

## Add to your model

```ts
// src/model.ts
import devToolsPlugin from "@prodo/devtools-plugin";

// ...

export const model = createModel<State>().with(devToolsPlugin);
```

## Config

Items added to the `createStore` config.

```ts
export interface DevToolsConfig {
  devtools?: boolean;
}
```

`devtools`

boolean that indicates whether or not developer tools are enabled. Defaults to `false`.

```ts
const { Provider } = model.createStore({
  devtools: true,
  initState: {
    /* ... */
  },
});
```
