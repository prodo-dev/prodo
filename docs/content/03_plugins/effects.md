---
title: "Effects"
order: 2
---

Enable mocking of side effects in testing.

## Installation

```shell
npm install --save @prodo/effect
```

## Add to your model

```ts
// src/model.ts
import effect from "@prodo/effect";

// ...

export const model = createModel<State>().with(effect);
export const { effect, /* ... */ } = model.ctx;
```

## Config

Items added to the `createStore` config.

- `mockEffects`: _optional_ object with keys as effect function name and values as array of
  results returned from calling the effect. You will typically only provide this
  option in your tests.

```ts
const { Provider } = model.createStore({
  logger: true,
  mockEffects: {
    effectName: ["result1", "result2"]
  }
});
```

## Usage

Consider a `newTodo` action in a to-do application. The action will generate a
random id for the new item and add it to the state.

```ts
import { state } from = "./model";

const newTodo = (text: string) => {
  const id = randomId();
  state.todos[id] = {
	text,
	done: false
  };
}
```

A test for this action will look something like:

```ts
test("create a new todo", async () => {
  const { store } = model.createStore({
    initState: { todos: {} },
  });
  
  const { state } = await store.dispatch(newTodo)("buy milk");
  expect(state).toEqual({
    T1: {
      text: "foo",
      done: false,
    },
  });
})
```

The problem with this is that we do not know what the new todos id will be,
which makes it hard to write a deterministic test. This is where the effect
plugin comes in.

In your action you can wrap the call to `randomId` with `effect`.

```ts
import { effect, state } from = "./model";

const newTodo = (text: string) => {
  const id = effect(randomId)();
  state.todos[id] = {
	text,
	done: false
  };
}
```

In your test provide a `mockEffects` config.

```ts
test("create a new todo", async () => {
  const { store } = model.createStore({
    initState: { todos: {} },
	mockEffects: {
	  randomId: ["T1"]
	}
  });
  
  const { state } = await store.dispatch(newTodo)("buy milk");
  expect(state).toEqual({
    T1: {
      text: "foo",
      done: false,
    },
  });
})
```

The first call to `randomId` will return `"T1"`, which we can use in the
`expect` of our test. If `randomId` is going to be called more than once, just
add more items to the `mockEffects` array.
