---
title: "Routing"
order: 3
---

Interact with your browser's location and history.

## Installation

```shell
npm install --save @prodo/route
```

## Add to your model

```ts
// src/model.ts
import routePlugin from "@prodo/route";

// ...

export const model = createModel<State>().with(routePlugin);
export const { route /* ... */ } = model.ctx;
```

## Config

Items added to the `createStore` config.

```ts
interface EffectConfig {
  route: {
    history: History;
  };
}
```

`route.history`

The `history` object used by the router. This is typically created using a library such as [history](https://www.npmjs.com/package/history).

In production, you would typically create a `History` that interacts with your user's browser, which can be created using the `history` package's `createBrowserHistory` method.

```ts
import { createBrowserHistory } from "history";
const history = createBrowserHistory();
const store = model.createStore({
  /* ... */
  route: { history },
});
```

In tests, you should instead use an in-memory `History`, which can be created using the `history` package's `createMemoryHistory` method:

```ts
import { createMemoryHistory } from "history";
const history = createMemoryHistory();
const store = model.createStore({
  /* ... */
  route: { history },
});
```

## Usage

### Using the Route

The plugin automatically adds a `route` property to your model's universe, which contains the following type:

```ts
interface RouteParam {
  path: string;
  params: { [key: string]: string };
}
```

`route.path` refers to the current path of the route, equivalent to `window.location.pathname`, while `params` contains any url parameters passed via the URL. These will be automatically decoded for you.

For example, the URL `https://localhost:8080/packages/prodo?status=OK&statusMsg=All%20good` will result in the following `route` property:

```ts
{
  path: "/packages/prodo",
  params: {
    status: "OK",
    statusMsg: "All good",
  }
}
```

You can read from this value in your actions and components by importing the `route` property from your model file. For example, in a component:

```tsx
import { route, watch } from "./model";

export const HomePage = () => (
  <div>The current route is {watch(route.path)}.</div>;
);
```

> Remember that, inside components, you should always wrap values from your context inside a call to `watch`.

### Changing the Route

The plugin exports two actions that can be dispatched to modify the current route, `push` and `replace`.

`push`

The `push` action will add a new entry to your history. This allows you to use the browser's back button to return to the previous route.

This action can either be passed a string, or a `Partial<RouteParams>` object:

```ts
import { push } from "@prodo/route";

dispatch(push)("/a/b/c");
// is the same as
dispatch(push)({
  path: "/a/b/c",
});

// and
dispatch(push)("/a/b/c?d=e");
// is the same as
dispatch(push)({
  path: "/a/b/c",
  params: {
    d: "e",
  },
});
```

`replace`

The `replace` action is similar to the `push` action, except that it will replace the current entry in the history instead pushing a new entry. This means that you cannot use the browser's back button to return to the previous route.

```ts
import { replace } from "@prodo/route";

dispatch(replace)("/a/b/c");
// or
dispatch(replace)({
  path: "/a/b/c",
});
```

### Declarative API

To allow for more declarative routing, the plugin also provides a few React components that can be used to declaratively determine what to render, and add elements such as links to your page. These are designed to be as close as possible to the counterparts defined in the popular [`react-router`](https://www.npmjs.com/package/react-router) library:

#### `Route`

This component will only render its children if the route matches the component's `path` property.

##### Props

`children: React.ReactNode`:

If a `Route` component is passed some children, it will render these children when the `route.path` matches it's `path` property. In the below example, the `HomePage` component will be rendered when `route.path` matches `"/home"`, and `UserPage` will be rendered when `route.path` matches `"/users/alex"`.

```tsx
import { Route } from "@prodo/route";

const App = () => (
  <div>
    <Route path="/home">
      <HomePage />
    </Route>
    <Route path="/users/:userId">
      <UserPage />
    </Route>
  </div>
);
```

Default: _None_

`component: React.ComponentType`:

If no `children` are provided, the `Route` will instead render the component that is passed to the `component` property.

```tsx
import { Route } from "@prodo/route";

const App = () => (
  <>
    <Route path="/home" component={HomePage} />
    <Route path="/users/:userId" component={UserPage} />
  </>
);
```

The `component` will be passed any parameters that come from matching `route.path` to `path` using `matchRoute` (see below for more information) - for example, if the above example was rendered with a `route.path` of `"/users/alex"`, then the UserPage component will receive the following props:

```ts
{
  userId: "alex",
}
```

Default: _None_

`path: string`

Must be a pattern that [`path-to-regexp@^3.1.0`](https://github.com/pillarjs/path-to-regexp) can understand.

Default: `"*"`

`exact: boolean`:

If `true`, the `Route` will only render if `route.path` matches the `path` property _exactly_. For example, `/a/b/c` matches the pattern `/a/b` if `exact` is set to false, but does not match is `exact` is set to `true`.

Default: `false`

#### `Switch`

The `Switch` component will render the first `Route` in its children that matches the current location.

```tsx
import { Switch, Route } from "@prodo/route";
const App = () => (
  <Switch>
    <Route exact path="/" component={HomePage} />
    <Route path="/users/:userId" component={UserPage} />
    <Route component={NotFoundPage} />
  </Switch>
);
```

In the above example, the `NotFoundPage` component will only be render if neither of the previous `Route`s match the current location.

#### `Link`

The `Link` component can be used to embed an interactive element, such as a hyperlink, that will update the `route` without refreshing the page.

```tsx
import { Link, Switch, Route } from "@prodo/route";

const App = () => (
  <Switch>
    <Route path="/home">Home Page</Route>
    <Route>
      <Link to="/home">Go Home</Link>
    </Route>
  </Switch>
);
```

##### Props

`component: React.ComponentType`

When specified, uses the passed component type to render the element, rather than the default anchor element `<a />`. This component is passed a property called `navigate` that should be called to update the `route`:

```tsx
interface Props {
  navigate: () => void;
}
const Button = ({ navigate }: Props) => (
  <button onClick={navigate}>{props.children}</button>
);
```

`to: string | Partial<RouteParams>`

Specifies the new route to be added to the history when `navigate` is called.

Default: _None_.

`replace: boolean`

By default, the `Link` will use the `push` action to update the history. If `replace` is set to `true`, then the `replace` action will be used instead.

Default: `false`

You can also pass props you'd like to be on the element, such as `className`, `id` etc.

#### `Redirect`

A component that, when rendered, will immediately redirect the page to a new route.

```tsx
import { Switch, Redirect, Route } from "@prodo/route";

const App = () => (
  <Switch>
    <Route path="/home" component={HomePage} />
    <Route path="/users/:userId" component={UserPage} />
    <Route>
      <Redirect to="/home" />
    </Route>
  </Switch>
);
```

In the above example, the user will be redirected to the home-page if their url does not match a valid route.

##### Props

`to: string | Partial<RouteParams>`

Specifies the new route to be added to the history when the `Redirect` is rendered.

Default: _None_.

`push: boolean`

By default, the `Redirect` will use the `replace` action to update the history. If `push` is set to `true`, then the `push` action will be used instead.

Default: `false`

### Utility Functions

#### `matchRoute`

The `matchRoute` function can be used to match a path against a pattern, and is used internally by the `Route` component.

```tsx
import { matchRoute } from "@prodo/route";

matchRoute("/", "/"); // Returns {}
matchRoute("/", "/home"); // Returns null
matchRoute("/home", "/"); // Returns {}
matchRoute("/home", "/", true); // Returns null
matchRoute("/users/alex", "/users/:userId"); // Returns { userId: "alex" }
```

##### Usage

```ts
matchRoute(path: string, pattern: string, exact?: boolean): {[key: string]: string};
```

`path: string`

The path to be checked

`pattern: string`

The pattern to check the `path` against. Must be a pattern that [`path-to-regexp@^3.1.0`](https://github.com/pillarjs/path-to-regexp) can understand.

`exact: boolean`

If `true`, the function will return non-null if `path` matches the `pattern` _exactly_. For example, `/a/b/c` matches the pattern `/a/b` if `exact` is set to false, but does not match is `exact` is set to `true`.

Default: `false`
