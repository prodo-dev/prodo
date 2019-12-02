---
title: "Getting Started"
order: 1
toc: true
---

Prodo is a web framework that enables you to write performant and scalable web
apps with as little boilerplate as possible. It was designed with TypeScript in
mind and even includes a babel plugin to further reduce the amount of
boilerplate.

# Setup

The easiest way to get started with Prodo is with
[create-prodo-app](/introduction/create-prodo-app). We also recommend using TypeScript.

```shell
# init
yarn create prodo-app my-app --typescript
# OR npx create-prodo-app my-app --typescript

# install
cd my-app
yarn

# start
yarn start
```

Navigate to [localhost:8080](http://localhost:8080) and you should see your app.

The app created with create-prodo-app (CPA) is fairly minimal, yet a good
starting point when creating simple or complex Prodo apps. It includes two
[Prodo plugins](/basics/plugins): logger and route. The logger plugin logs useful
information about your app to the console and the route plugin gives you client
side routing.

# Basic Example

This section walks you through the main concepts of Prodo. We are creating a
simple "Counter" app, assuming basic knowledge of
[ES6](https://www.w3schools.com/js/js_es6.asp) and [React](https://reactjs.org).
The following example assumes you have created an app with create-prodo-app. All code
snippets use the babel plugin.

The typical workflow in developing a Prodo app is to

1. **Specify a model, specifying the types (if you want to use TypeScript)**
2. **Define your actions as simple functions mutating the state of your model**
3. **Use functional React components to render the model in its current state**

## Specifying the Model

The [model](/basics/model) holds all of the types used in your actions and components
in a file called `src/model.ts`. Edit the file with the following contents:

```ts
// src/model.ts
import { createModel } from "@prodo/core";
import loggerPlugin from "@prodo/logger";
import routePlugin from "@prodo/route";

// highlight-start
export interface State {
  count: number;
}
// highlight-end

export const model = createModel<State>()
  .with(loggerPlugin)
  .with(routePlugin);

export const { state, watch, dispatch } = model.ctx;
```

Here, the state contains a single `count` value. We then create our model with this state type
and export any variables from our model that are used elsewhere in our app.
These variables that are exported from our model are correctly typed with our
state.

## Defining Actions

[Actions](/basics/actions) are simple functions that can read from the state and write to the state. They cannot return anything. They can
take arguments, trigger side effects (see [effect plugin](/plugins/effects)), and dispatch other actions (see [dispatch](/basics/actions#dispatch)). We can create
an action in the `src/pages/App.tsx` file.

```tsx
// src/pages/Home.tsx
import * as React from "react";
import { state, watch, dispatch } from "../model";

// highlight-start
const changeCount = (amount: number) => {
  state.count += amount;
};
// highlight-end

const Home = () => <div />;

export default Home;
```

This action changes the count in our state by a specified amount. This action can
be triggered in a component or another action with the `dispatch` function.

```ts
dispatch(changeCount)(1);
```

## React Components

[Components](/basics/components) take the state of your application and render
it as JSX. Those components are writen with React and let you automatically
"watch" for changes to the state. Under the hood, the component will start a
subscription to the corresponding state path and trigger a re-render whenever
the value changes.

```tsx
// src/pages/Home.tsx
import * as React from "react";
import { state, watch, dispatch } from "../model";

const changeCount = (amount: number) => {
  state.count += amount;
};

const Home = () => (
  <div>
    // highlight-start
    <h1>{watch(state.count)}</h1>
    // highlight-end
  </div>
);

export default Home;
```

Here we simply show the the `state.count` value.

Components can also trigger actions. Lets create two buttons to increment and
decrement the counter using the action we defined above.

```tsx
// src/pages/Home.tsx
import * as React from "react";
import { state, watch, dispatch } from "../model";

const changeCount = (amount: number) => {
  state.count += amount;
};

const Home = () => (
  <div>
    // highlight-next-line
    <button onClick={() => dispatch(changeCount)(-1)}>-</button>
    <h1>{watch(state.count)}</h1>
    // highlight-next-line
    <button onClick={() => dispatch(changeCount)(1)}>+</button>
  </div>
);

export default Home;
```

## Creating the Store

When starting your app, you need to create a [store](/basics/store) with your
app's initial state. We then wrap the application into a
[Provider](/api-reference/provider) to make this store accessible in all of the
components.

```tsx
// src/index.tsx
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { model } from "./model";
import { createBrowserHistory } from "history";

import "./styles.css";

const history = createBrowserHistory();

const { Provider } = model.createStore({
  logger: true,
  route: {
    history,
  },
  // highlight-start
  initState: {
    count: 0,
  },
  // highlight-end
});

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById("root"),
);
```

## Running your Application

Run `yarn start` or `npm start` to start your application. You should see the
current count and a decrease and increase button. Clicking the buttons should
change the count.
