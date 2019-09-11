---
title: "Core Concepts"
order: 4
---

# Core Concepts

At a high level, the main concepts of Prodo are

- Single source of truth for all application state. Those familiar with the
  [flux architecture pattern](https://facebook.github.io/flux/) will be familiar
  with Prodo.
- Minimal boilerplate. A babel plugin is provided that adds the glue needed to
  convert the code you write to JavaScript that will run in the browser.
- Type safe. Prodo is written in TypeScript which means that you have the option
  of easily typechecking your entire app.
  
The types for your app state and any plugin state are contained in your
**model**. You then use variables from this model to watch parts of the state,
dispatch actions, or interact with plugins. The beneifit of using variables from
your model is that they are all typed properly.

```ts
export interface State {}

export const model = createModel<State>();
export const { state, watch, dispatch } = model.ctx;
```

Your application state is all contained in a single **store** which is created
from your model. This store is your apps single source of truth.

```ts
const store = model.createStore({
  initState: {
    count: 0,
  },
});
```

Actions are functions that may modify the store. They are just regular
functions.

```ts
const myAction = (arg: string) => {
  state.foo = arg;
}
```

Components are React components that watch part of the store and will re-render
when any watched part of the store changes. Components can also trigger actions.

```tsx
export const MyComponent = () => (
  <div onClick={() => dispatch(myAction)("value")}>
    {watch(state.foo)}
  </div>
);
```
