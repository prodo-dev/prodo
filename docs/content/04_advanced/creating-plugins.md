---
title: "Creating Plugins"
order: 1
---

The plugin type is defined as follows:

```tsx
export interface ProdoPlugin<Config, Universe, ActionCtx, ViewCtx> {
  name: string;
  init?: (config: Config, universe: Universe) => void;
  prepareActionCtx?: (
    env: { /* ... */ },
    config: Config,
  ) => void;
  prepareViewCtx?: (
    env: { /* ... */ },
    config: Config,
  ) => void;
}
```

The `ProdoPlugin` type takes four type parameters:

1. The configuration type
2. The Universe type
3. The action context type
4. The view context type

A plugin provides the following attributes (only `name` is required):

- `name`: The name of the plugin
- `init`: Any set-up code that must be run, taking the configuration and
preparing the [Universe](#universe).
- `prepareActionCtx` and `prepareViewCtx`: Functions to prepare the context
passed in to the view or action. At least one of these should be defined for a
plugin to be useful.

## Creation

A plugin definition is usually a generic function, that returns a `ProdoPlugin`.

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

This function is responsible for setting up private state (if required), and
allowing user-defined type parameters.

## Contexts

The `prepare*Ctx` functions hold the core functionality of a plugin. They are
responsible for adding properties to the context, which is then passed to the
view/action respectively.

For example, the `localPlugin` adds the `local` property to both contexts:

```ts
const prepareViewCtx = <T>({ ctx }: { ctx: ViewCtx<T> }) => {
  ctx.local = createUniverseWatcher("local");
};

const prepareActionCtx = <T>(
  {ctx, universe}: {ctx: ActionCtx<T>; universe: Universe<T>}
) => {
  ctx.local = new Proxy(
    {},
    {
      get(target, key) { /* ... */ },
      set(target, key, value) { /* ... */},
    },
  ) as Partial<T>;
};
```

The above example does not make use of any plugin private state. If they did,
the functions would first take a state parameter, and then return the relevant
`prepareCtx` function. For example:

```ts
const prepareViewCtx = <T>(state: StateType) => ({ ctx }: { ctx: ViewCtx<T> }) => {
  ctx.local = createUniverseWatcher("local");
};
```

## Universe

The Universe is used to cause indirectly a view to re-render from an action. A
plugin binds part of the Universe to the view context by using the
`createUniverseWatcher` function.

Then, the component can call `watch` on `local` (or its properties). When the
the `local` property of the universe is modified, any components watching the
corresponding part of the context are re-rendered.

This is often done by creating a proxy in the `prepareActionCtx` function, that
traps writes and passes the modification on to the underlying universe. For
example:

Internal state of a plugin that is not expected to be watched from a component
should *not* be stored in the universe. See [creation](#Creation) above.
