---
title: "Local Storage"
order: 4
---

Seamless integration with browser `localStorage.`

## Installation

```shell
npm install --save @prodo/local
```

## Add to your model

The local plugin is parameterised by the type of data you will have in local storage.

```ts
// src/model.ts
import local from "@prodo/local";

// ...

export interface Local {
  count: number;
}

export const model = createModel<State>().with(local<Local>());
export const { local, /* ... */ } = model.ctx;
```

## Config

Items added to the `createStore` config.

```ts
export interface Config<T> {
  initLocal?: Partial<T>;
  localFixture?: Partial<T>;
}
```

`initLocal`

Fallback values to use if an item is not in local storage.

`localFixture`

Mock local storage to use in your tests.

## Usage

### Actions

You can use the `local` variable from the model to access or save data to local
storage in an action.

```ts
import { local } from "./model";

const changeCount = (amount: number) => {
  local.count = local.count + amount;
}
```

### Components

You can `watch` any part of the local state in your components.

```tsx
import { local, watch } from "./model";

const MyComponent = () => (
  <h1>Count {watch(local.count)}</h1>
);
```

_Note: changes to local storage are only picked up when modified from a
Prodo action._

### Tests

Use the `localFixture` config option to mock local storage in your tests.

```ts
it("can increase the count", () => {
  const { store } = model.createStore({
    initState: { todos: {} },
	localFixture: {
	  count: 0
	}
  });
  

  expect(store.universe.local.count).toBe(10);
  const { local } = await store.dispatch(changeCount)(10);
  expect(local.count).toBe(10);
})
```
