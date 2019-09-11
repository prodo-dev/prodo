---
title: "Testing"
order: 7
---

A goal of the Prodo framework is to ensure testing your app is just as easy as
writing it. You can use any testing framework you are familiar with, such as
[Jest](https://jestjs.io/), which will be used in this example.

## Actions

Testing actions consists of creating a store from your mode, dispatching some
actions, and checking the final state.

Lets create a test for the `changeCount` action created in the [getting
started](/introduction/getting-started) guide.

```ts
import { model } from "../src/model";
import { changeCount } from "../src/App";

test("increases the count", async () => {
  const { dispatch } = model.createStore({
    initState: {
	  count: 0
	},
  });

  const { state } = await dispatch(changeCount)(1);
  expect(state.count).toBeEqual(1)
});
```

## Components
