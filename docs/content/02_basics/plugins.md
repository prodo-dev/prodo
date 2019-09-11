---
title: "Plugins"
order: 8
---

Note: see [Prodo plugins](./prodo-plugins) for a list of all provided plugins
and their API.

A plugin adds additional properties to the view and action contexts (see
[components](./components) and [action](./actions) respectively).

## Model

Plugins are added to a model with the model's `with` method.

For example, to store our counter in local storage, we would add the
`localPlugin` with `State` as its type parameter [^1] to the model. The returned
model has a different type, so that all views and actions using it remain
type-safe.

```tsx
interface State {
  count: number;
}

export const model = createModel<{}>().with(localPlugin<State>)
```

[^1]: The state is now just the `{}`, since there is no remaining state.

## In Views and Actions

The properties exposed by a plugin are used the same way the core properties
(e.g. `state`) are.

```tsx
export Counter = () => {
  return <div>
    <span>Hello, {watch(local.count)}!</span>
  </div>;
}

export increment = () => {
  local.count += 1;
}
```

Note the API of a plugin may differ between views and actions - for example,
views will be read-only, while actions may have side effects.

