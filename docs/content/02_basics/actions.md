---
title: "Actions"
order: 4
---

An action is a function that modifies a store. It cannot return anything. For
example:

```ts
const changeCount = (amount: number) => {
  state.count += amount;
};
```

# State

Actions may modify the `state` directly. However, this isn't a mutation on the
global store. The `state` is actually an
[immer](https://github.com/immerjs/immer) proxy and all modifications to the
state are private to the action until it completes, at which point they are committed
to the store state and trigger re-renders of any affected components.

# Dispatch

Actions may trigger child actions with the `dispatch` function. for example:

```ts
const parentAction = () => {
  dispatch(childAction)("foo");
  console.log("In parent action");
  dispatch(childAction)("bar");
  state.value = 4;
};

const childAction = (name: string) => {
  console.log("In child action", name, state.value);
};
```

Within an action, dispatching an action schedules a child action (for
dispatching an action in reponse to user input, see [components](./components)).
This will not begin execution until the current action has completed, and will
see all changes made to the state from the current action.

Dispatching `parentAction` above will produce the following output:

```
In parent action
In child action foo 4
In child action bar 4
```

# Transpilation

The transpiler detects an action as any function that uses the attributes
exported from `createModel`, and is assigned to a lower-case identifier
(upper-case identifiers are used for [components](./components)).

```tsx
import { state } from "./model";

export const increment = (amount: number) => {
  state.count += amount;
};
```

is converted to

```tsx
import { model } from "./model";

export const increment = model.action(
  ({ state }) => (amount: number) => {
    state.count += amount;
  },
  "increment",
);
```
