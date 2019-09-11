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

For example, to store our counter in local storage, we would add the localPlugin
with `State` as its type parameter [^1] to the model. The returned model has a
different type, so that all views and actions using it remain type-safe.

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

# Writing Plugins

A plugin must provide the following attributes:

`name`: The name of the plugin
`init` (optional): Any set-up code that must be run, taking the configuration
and preparing the [Universe](#Universe).
`prepareActionCtx` and `prepareViewCtx` (optional): Functions to prepare the
context passed in to the view or action. At least one of these should be defined
for a plugin to be useful.

These are used to construct a `ProdoPlugin` object. The `ProdoPlugin` type takes
four type parameters:

1. The configuration type
2. The Universe type
3. The action context type
4. The view context type

## Creation

A plugin definition is usually a generic function, that returns a plugin with
the attributes and type parameters above.

```ts
export default myPlugin = <T>(): ProdoPlugin<
  Config,
  Universe<T>,
  ViewCtx<T>,
  ActionCtx<T>,
> => {
  const state = { /* ... */ };
  return {
    name: "myPlugin",
    init: init(state),
    prepareViewCtx: prepareViewCtx(state),
    prepareActionCtx: prepareActionCtx(state),
  };
}
```

This function is responsible for setting up private state, and defining any type
parameters the plugin takes.

## Contexts

The `prepare*Ctx` functions hold the core functionality of a plugin. They are
responsible for adding properties to the context, which is then passed to the
view/action respectively.

## Universe

The Universe is used to cause indirectly a view to re-render from an action. A
plugin binds part of the Universe to the view context by using the
`createUniverseWatcher` function:

```ts
const prepareViewCtx = <T>({ ctx }: { ctx: ViewCtx<T> }) => {
  ctx.local = createUniverseWatcher("local");
};
```

Then, the component can call `watch` on `local` (or its properties). When the
the `local` property of the universe is modified, any components watching the
corresponding part of the context are re-rendered.

This is often done by creating a proxy in the `prepareActionCtx` function, that
traps writes and passes the modification on to the underlying universe. For
example:

```ts
const prepareActionCtx = <T>(
  {ctx, universe}: {ctx: ActionCtx<T>; universe: Universe<T>}
) => {
  ctx.local = new Proxy(
    {},
    {
      get(_target, key) {
        const item = localStorage.getItem[key.toString()];
        return JSON.parse(item);
      },
      set(_target, key, value) {
        universe.local[key.toString()] = value;
        return true;
      },
    },
  ) as Partial<T>;
};
```

Internal state of a plugin that is not expected to be watched from a component
should *not* be stored in the universe. See [creation](#Creation) above.
