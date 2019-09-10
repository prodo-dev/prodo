---
title: "Components"
order: 4
---

A Prodo component is a wrapper around a React component, giving access to the
properties of a model. A component can be created from a React component
manually with the `connect` method of a model, or automatically through
[transpilation](#transpilation).

Additional variables can be provided by [plugins](./plugins). 

# State

The `state` variable holds the current state. To ensure the component is
re-rendered when the state is updated, accesses must be wrapped in `watch`.

`watch` the narrowest scope possible to avoid unnecessary re-renders. For
example `watch(state.foo.bar)` is more efficient than `watch(state.foo).bar` but
functionally equivalent.

# Dispatch

The `dispatch` function is responsible for running actions, for example
`dispatch(increment)(5)`. It takes as its only parameter the action to run, and
the result is then called with the parameters of the action.

# Transpilation

The transpiler detects a component as any function that uses the attributes
exported from `createModel`, and is assigned to an upper-case identifier
(lower-case identifiers are used for [actions](./actions.md)).

```jsx
import { state } from "./model";

export Counter = () => {
  return <div>
    <span>Hello, {watch(state.name)}!</span>
  </div>;
}
```

is converted to

```jsx
import model from "./model";

export Counter = model.connect(
  ({state}: Ctx) => () => {
    return <div>
      <span>Hello, {watch(state.name)}!</span>
    </div>;
  },
  "Counter"
)
```
