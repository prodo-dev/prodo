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
- Wrap the entire user app with a React component.

A plugin is parameterised by five type parameters. These are:

- `InitOptions`: Type for config that should be provided by user when they
  create the store.
- `Universe`: Type of the data that the plugin is extending the
  [universe](./universe) with.
- `ActionCtx`: Type that the plugin is extending the [action context](#prepare-action-context) with.
- `ViewCtx`: Type that the plugin is extending the [view context](#prepare-view-context) with.
- `CustomEvent`: _Optional_ type that the plugin is extending the event type with.

Plugins are created with the `createPlugin` function. The signature is:

```ts
export const createPlugin = <
  InitOptions,
  Universe,
  ActionCtx,
  ViewCtx,
  CustomEvent = {}
>(
  name: string,
): ProdoPlugin<InitOptions, Universe, ActionCtx, ViewCtx, CustomEvent>;
```

The `name` is the name of the plugin.

For example:

```ts
import { createPlugin } from "@prodo/core";
import { Config, Universe, ActionCtx, ViewCtx } from "";

const myPlugin = createPlugin<Config, Universe, ActionCtx, ViewCtx>(
  "awesome-plugin",
);

export default myPlugin;
```

Functionality is added to plugins by calling functions on the plugin object that
add _hooks_ into different parts of the framework. The available hooks are:

- `init`: Called when the user creates the store. This is typically used to
  prepare the universe.
- `prepareActionCtx`: Called right before an action is executed.
- `prepareViewCtx`: Called right before a connected component is rendered.
- `onCompleteEvent`: Called after an action has completed.
- `Provider`: React component that wraps the user app.

A detailed description of each hook is below.

## Init

`init` is called once when the [`Store`](/api-reference/store) is created. It
can be used to setup the universe. The `universe` in init is an immer proxy and
can be modified directly. The signature of the `init` hook is:

```ts
export type PluginInitFn<InitOptions, Universe> = (
  config: InitOptions,
  universe: Universe,
  store: { dispatch: PluginDispatch<any> },
) => void;
```

For example:

```ts
plugin.init((config, universe) => {
  universe.foo = config.foo;
});
```

## Prepare Action Context

`prepareActionCtx` is called before each action is executed. In this function a
plugin can setup any variables or methods available to the user in their
actions. The `universe` in prepareActionCtx is an immer proxy and can be
modified directly. The signature of the `prepareActionCtx` hook is:

```ts
export type PluginActionCtxFn<
  InitOptions,
  Universe,
  ActionCtx,
  CustomEvent = {}
> = (
  env: {
    ctx: PluginActionCtx<ActionCtx, Universe> & ActionCtx;
    universe: Universe;
    event: Event & CustomEvent;
  },
  config: InitOptions,
) => void;
```

For example, the effect plugin adds an `effect` function to the action context:

```ts
plugin.prepareActionCtx(({ ctx }) => {
  ctx.effect = func => (...args) => {
    /* ... */
  };
});
```

## Prepare View Context

`prepareViewCtx` is called before each components render method is called. It
should not do any heavy computation. In this function a plugin can setup any
variables or methods available to the user in their component. The `universe`
**is not** directly modifiable and you should [use actions](#plugin-actions) if
you want to modify it. The signature of the `prepareViewCtx` hook is:

```ts
export type PluginViewCtxFn<InitOptions, Universe, ActionCtx, ViewCtx> = (
  env: {
    ctx: PluginViewCtx<ActionCtx, Universe> & ViewCtx;
    universe: Universe;
    comp: Comp;
  },
  config: InitOptions,
) => void;
```

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
plugin.prepareViewCtx = ({ ctx }) => {
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
event is passed as an argument. The signature of the `onCompleteEvent` hook is:

```ts
export type PluginOnCompleteEventFn<InitOptions, CustomEvent> = (
  event: Event & CustomEvent,
  config: InitOptions,
) => void;
```

For example, the [logger](/plugins/logger) plugin uses `onCompletedEvent` to log the action.

```ts
plugin.onCompleteEvent(event => {
  console.log(event);
});
```

## Provider

Plugins can expose a React component that will be wrapped around the top
level user app.

For example:

```tsx
plugin.setProvider(({ children }) => <div>{children}</div>);
```

## Plugin Actions

Plugins can create and dispatch actions similar to how a user action is created
and dispatched. Plugin actions are created with `plugin.action`. The signature
of the action creator is:

```ts
export type PluginActionCreator<ActionCtx> = <A extends any[]>(
  func: (ctx: ActionCtx) => (...args: A) => void,
  actionName: string,
) => (ctx: ActionCtx) => (...args: A) => void;
```

For example:

```ts
const myPluginAction = plugin.action(
  ctx => (amount: number) => {
    ctx.myPluginContext.count += amount;
  },
  "myPluginAction",
);
```
