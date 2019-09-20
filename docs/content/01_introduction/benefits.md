---
title: "Benefits"
order: 3
---

Below are a few snippets of code illustrating the key benefits of Prodo.

## Drastically simplified state management 🎉

What's special about Prodo is not what you do with it. It's the long list of things you no longer need to worry about when building an app.

Just to give a few examples:

- You won't need to explicitly define the "observables" parts of you state, as you would with MobX. Instead, you can watch any part of the state.
- No need to define a constant type string for each of your actions, as you would with Redux. Instead, Prodo directly uses your functions' names.
- No need to choose a specific framework or middleware to handle asynchronous actions. You'll just write "async" in front of your function declaration.
- No need to wrap all of your components inside connect functions, nor to explicitly provide a type definition for every injected variable. Prodo's transpiler automatically connects your components in a way that lets TypeScript infer all the types.
- No need for reducers or any unnecessary abstraction. Instead you manipulate your state as if it was a simple JSON object, and [immer](https://github.com/immerjs/immer) takes care of tracking changes without performing any harmful mutations.

## Minimal boilerplate, especially compared to Redux ✨

If you're coming from Redux, you might be used to deal with things like action types, action creators, and middleware. None of that is required with Prodo since actions are defined as functions, and then dispatched directly from components or other actions.

```tsx
const setCount = x => {
  state.count += x;
};

const increment = x => {
  dispatch(setCount)(x);
};

const Counter = () => (
  <button onClick={() => dispatch(increment)(1)}>{watch(state.count)}</button>
);
```

## Blazingly fast re-rendering ⚡️

Details of the algorithm are yet to be documented, but you can look at [core/src/watch.ts](https://github.com/prodo-ai/prodo/blob/master/packages/core/src/watch.ts) to see how Prodo figures out which components need to be rerender when a sets of state patches are submitted to the store.

## Handles async actions out of the box 👯‍♀️

Prodo lets you write this:

```ts
const updateUserImage = async uid => {
  const avatar = await fetch(`http://some.api.com/${uid}`);
  state.user[uid].image = avatar;
};
```

## First class support for TypeScript 🔎

Web frameworks designed before 2017 targeted JavaScript first, and they added TypeScript support as an afterthought. As a result, users often need to specify a lot of types manually. In contrast, Prodo was built for TypeScript users from day one, while keeping the type-related boilerplate minimal.

```ts
import {state} from "./model";
state.todos[id].
           // >.text: string
           // >.done: boolean
```

## Easily Testable ✅

You can leverage the `react-testing` library with Prodo to write a wide range of tests.
For instance:

```tsx
test("increases the count when the button is clicked", async () => {
  const { container, getByText } = testRender(<App />, { initState });
  fireEvent.click(getByText("+"));
  await waitForDomChange({ container });
  expect(container.textContent).toBe("1");
});
```

## Powerful Plugins 💪

You can extend the functionality of the framework with official or third party
[plugins](/basics/plugins) that easily work together.
