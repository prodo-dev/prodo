# Prodo Developer Tools

This is the core package for the Prodo Development Tools.
The tools are implemented in Prodo.

## Installation

Add the devtools-plugin to your model so that your app and the devtools can communicate properly.

```ts
import { createModel } from "@prodo/core";
import devToolsPlugin from "@prodo/devtools-plugin";

export interface State {}

export const model = createModel<State>()
  .with(devToolsPlugin);
```

To show the devtools next to your app, turn the `devtools` variable to true when you create your store.

```ts
const { Provider } = model.createStore({ devtools: true, initState });
```

## Usage

Currently, you can use these devtools as a wrapper component around your Prodo application.

### Wrapper Component

All you have to do is install the plugin as described above and set the `devtools` variable to true when you create your store.
