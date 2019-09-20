---
title: "Testing"
order: 5
---

One of the goals of the Prodo framework is to ensure testing your app is as
easy as writing it. You can use any testing framework you are familiar with,
such as [Jest](https://jestjs.io/), which will be used in this example.

## Actions

Testing actions consists of creating a store from your model, dispatching some
actions, and checking the final state.

Lets create a test for the `changeCount` action created in the [getting
started](/introduction/getting-started) guide.

```ts
import { model } from "../src/model";
import { changeCount } from "../src/App";

test("increases the count", async () => {
  const { dispatch } = model.createStore({
    initState: {
      count: 0,
    },
  });

  const { state } = await dispatch(changeCount)(1);
  expect(state.count).toBeEqual(1);
});
```

## Components

Like actions, you can test components with any testing library. However, we
recommend using [Jest](https://jestjs.io/) and [React testing
library](https://testing-library.com/docs/react-testing-library/intro).

Any components you want to test must be wrapped in a Prodo context. Create a
function to wrap the render from `@testing-library/react`.

```tsx
import { ProdoProvider, Store } from "@prodo/core";
import { render } from "@testing-library/react";
import * as React from "react";
import App from "../src/App";
import { model } from "../src/model";

const renderWithProdo = (ui: React.ReactElement, store: Store<any, any>) => {
  return {
    ...render(<ProdoProvider value={store}>{ui}</ProdoProvider>),
    store,
  };
};
```

You can test your component with different store configs.

```tsx
import { initState } from "./model";

test("can render with initial state", async () => {
  const { container } = renderWithProdo(
    <App />,
    model.createStore({ initState }),
  );

  expect(container.textContent).toBe("0");
});

test("can render with count set to 100", async () => {
  const { container } = renderWithProdo(
    <App />,
    model.createStore({
      initState: {
        count: 100,
      },
    }),
  );

  expect(container.textContent).toBe("100");
});
```

Interact with DOM elements with `fireEvent`.

```tsx
import { fireEvent, render, waitForDomChange } from "@testing-library/react";

// ...

test("increases the count when the button is clicked", async () => {
  const { container, getByText } = renderWithProdo(
    <App />,
    model.createStore({ initState }),
  );

  expect(container.textContent).toBe("0");
  fireEvent.click(getByText("+"));
  await waitForDomChange({ container });
  expect(container.textContent).toBe("1");
});
```
