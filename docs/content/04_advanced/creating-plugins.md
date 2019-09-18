---
title: "Creating Plugins"
order: 1
experimental: true
---

Prodo plugins are an essential part of the framework and can add a lot of
functionality to a user's app. Plugins have the power to:

- Expose methods or variables that interact with or modify the store in an
  action or component.
- Subscribe a component to a particular part of the [universe](./universe) so
  the component will re-render when that data changes.
- Wrap the entire user app with a React context provider.

The plugin type is defined as follows:

```tsx
export interface ProdoPlugin<Config, Universe, ActionCtx, ViewCtx> {
  name: string;
  init?: (config: Config, universe: Universe) => void;
  prepareActionCtx?: (
    env: {
      ctx: PluginActionCtx<ActionCtx, Universe> & ActionCtx;
      universe: Universe;
      event: Event;
    },
    config: Config,
  ) => void;
  prepareViewCtx?: (
    env: {
      ctx: PluginViewCtx<ActionCtx, Universe> & ViewCtx;
      universe: Universe;
      comp: Comp;
    },
    config: Config,
  ) => void;
  onCompletedEvent?: (event: Event) => void;
  Provider?: Provider;
}
```

The `ProdoPlugin` type takes four type parameters:

1. The configuration type
2. The Universe type
3. The action context type
4. The view context type

A plugin provides the following attributes (only `name` is required):

- `name`: The name of the plugin
- `init`: Any setup code that must be run. It typically prepares the [universe](./universe).
- `prepareActionCtx` and `prepareViewCtx`: Functions to prepare the context
passed in to the component or action.
- `onCompletedEvent`: Function that is called with the details of the event when
  it has completed.
  
## Creation

A plugin definition is usually a generic function that returns a `ProdoPlugin`.

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

## Init

`init` is called once when the [`Store`](/api-reference/store) is created. It
can be used to setup the universe. The `universe` in init is an immer proxy and
can be modified directly.

```ts
const init = <T>(config: Config<T>, universe: Universe<T>) => {
  // ...
  universe.local = {};
}
```

## Prepare Action Context

`prepareActionCtx` is called before each action is executed. In this function a
plugin can setup any variables or methods available to the user in their
actions. The `universe` in prepareActionCtx is an immer proxy and can be
modified directly.

For example, the [local plugin](/plugins/local) exposes the `local` property
which is a proxy into local storage.

```ts
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

## Prepare View Context

`prepareViewCtx` is called before each components render method is called. It
should not do any heavy computation. In this function a plugin can setup any
variables or methods available to the user in their component. The `universe`
**is not** directly modifiable and you should [use actions](#plugin-actions) if you want to modify it.

There are two options available to subscribe the calling component to a
particular path of the [universe](./universe). These are

- Using `createUniverseWatcher`
- Calling `ctx.subscribe`

### Create Universe Watcher

```ts
createUniverseWatcher(universeKey: string);
```

This should be used when the user will access something on the universe
directly. For example, if when the user accesses `yourPlugin.a.b.c` in a
component and you want to subscribe them to `universe.yourPlugin.a.b.c`, then
you should use `createUniverseWatcher`.

`createUniverseWatcher` takes a single string argument which is a top level key
on the universe. The return value can be passed in into `watch`, which will
subscribe the component to that path of the universe. For example, in the local
plugin,

```ts
const prepareViewCtx = <T>({ ctx }: { ctx: ViewCtx<T> }) => {
  ctx.local = createUniverseWatcher("local");
};
```

If a user then in their component has

```tsx
<div>{watch(local.a.b.c)}</div>
```

their component will be subscribed to path `["local", "a", "b", "c"]` of the
universe and will automatically update whenever the data at that path changes. 

### Subscribe

This should be used when you want to subscribe the user to part of the universe
indirectly. For example, if the user can call a function in their component that
subscribes them to part of the universe, then you should use `ctx.subscribe`.

A component can subscribe a component to a path on the universe manually using `ctx.subscribe`.

```ts
subscribe: (path: string[], unsubscribe?: () => void) => void;
```

Whenever `path` on the universe changes, the subscribing component will update.
The second argument to `subscribe` is an unsubscribe method that will be called
whenever the component unsubscribes from that path of the universe. You can use
the `unsubscribe` method to do any cleanup required.

## On Completed Event

`onCompletedEvent` is called when an event (action) is completed. The entire
event is passed as an argument. For example, the [logger](/plugins/logger)
plugin uses `onCompletedEvent` to log the action.

```ts
const onCompletedEvent = event => {
  console.log(event);
}
```

## Provider

Plugins can expose a `Provider` component that will be wrapped around the top
level user app.

## Plugin Actions

Components call create and dispatch actions similar to how a user action is
created and dispatched.

_To Do_

