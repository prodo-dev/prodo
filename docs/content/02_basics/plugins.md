---
title: "Plugins"
order: 6
---

A plugin adds additional properties to the component and action contexts (see
[components](./components) and [action](./actions) respectively).

## Model

Plugins can be installed via NPM and added to our plugin with the model's `with`
method. The returned model has a different type, so that all components and
actions using it remain type-safe. When using plugins, you need to export any
variable that comes from the plugin in a similar way to how you export `state`,
`dispatch`, and `watch`.

For example, we can use the [local](/plugins/local) plugin to add local
storage support to our app.

```tsx
import { createModel } from "@prodo/core";
import localPlugin from "@prodo/local";

interface LocalState {
  count: number;
}

export const model = createModel<{}>().with(localPlugin<State>);

export const { state, watch, dispatch, local } from model.ctx;
```

## In Components and Actions

The properties exposed by a plugin can be used in actions or components. See the
plugin documentation for the exact details on how these properties can be used.

```tsx
import { local, watch } from "./model";

export incrementLocalAction = () => {
  local.count += 1;
}

export Counter = () => {
  return <div>
    <span>Hello, {watch(local.count)}!</span>
  </div>;
}
```

See [Prodo plugins](/plugins) for a list of all provided plugins
and their API.
