# Prodo Developer Tools

This is the core package for the Prodo Development Tools.
The tools are implemented in Prodo.

## Installation

Add the devtools-plugin to your model so that your app and the devtools can communicate properly.

```
import { createModel } from "@prodo/core";
import devToolsPlugin from "@prodo/devtools-plugin";

export interface State {
}

export const model = createModel<State>()
  .with(devToolsPlugin);
```

## Usage

Currently, you can use these devtools as a wrapper component around your Prodo application.

Soon we will add an option to run the developer tools as a standalone application. We are also planning to add a browser extension shortly.

### Wrapper Component

All you have to do is install the plugin as described above.