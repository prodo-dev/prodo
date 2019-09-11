---
title: "Actions"
order: 6
---

An action is a function that modifies a store.

# State

The `state` provided to the action is an [immer](https://github.com/immerjs/immer)
proxy. All modifications to the state are private to the action until it
completes, at which point they are committed to the store state and trigger
re-renders of any affected components.

# Dispatch

The `dispatch` function is responsible for scheduling child actions, for example:

```ts
const parentAction = () => {
  dispatch(childAction)("foo");
  console.log("In parent action");
  dispatch(childAction)("bar");
  state.value = 4
}

const childAction = (name: string) => {
  console.log("In child action", name, state.value)
};
```

Within an action, dispatching an action schedules a child action[^1]. This will
not begin execution until the current action has completed, and will see all
changes made to the state from the current action.

Dispatching `parentAction` above will produce the following output:

```
In parent action
In child action foo 4
In child action bar 4
```

# Transpilation

The transpiler detects a component as any function that uses the attributes
exported from `createModel`, and is assigned to a lower-case identifier
(upper-case identifiers are used for [components](./components)).

```tsx
import { state } from "./model";

export const increment = () => {
  state.count += 1;
}
```

is converted to

```tsx
import model from "./model";

export const increment = model.action(
  ({state}: Ctx) => () => {
    state.count += 1
  },
  "increment"
)
```

[^1]: for dispatching an action in response to user input, see
    [components](./components)
