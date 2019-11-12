import { Store } from "@prodo/core";
import { Provider } from "@prodo/core/src";
import { fireEvent, render, waitForDomChange } from "@testing-library/react";
import * as React from "react";
import App, { Item } from "../../src/App";
import { model } from "../../src/model";
import { initState } from "../../src/store";

const renderWithProdo = (
  ui: React.ReactElement,
  context: { store: Store<any, any>; Provider: Provider },
) => {
  return {
    ...render(<context.Provider>{ui}</context.Provider>),
    store: context.store,
  };
};

describe("components", () => {
  it("can render with initial store", async () => {
    const { getByTestId, findAllByTestId } = renderWithProdo(
      <App />,
      model.createStore({ initState }),
    );

    expect(getByTestId("list").textContent).toContain("milk");
    expect(await findAllByTestId("item")).toHaveLength(1);
  });

  it("can render specific item", async () => {
    const { getByTestId } = renderWithProdo(
      <Item id="T2" />,
      model.createStore({
        initState: {
          todos: {
            T1: {
              text: "one",
              done: false,
            },
            T2: {
              text: "two",
              done: false,
            },
          },
        },
      }),
    );
    expect(getByTestId("item").textContent).toEqual("twox");
  });

  it("can render with empty store", async () => {
    const { getByTestId } = renderWithProdo(
      <App />,
      model.createStore({
        initState: {
          todos: {},
        },
      }),
    );
    expect(getByTestId("list").textContent).toBe("");
  });

  it("can render with store with multiple items", async () => {
    const { findAllByTestId } = renderWithProdo(
      <App />,
      model.createStore({
        initState: {
          todos: {
            T1: {
              text: "one",
              done: false,
            },
            T2: {
              text: "two",
              done: false,
            },
            T3: {
              text: "three",
              done: false,
            },
          },
        },
      }),
    );

    expect(await findAllByTestId("item")).toHaveLength(3);
  });

  it("delete all items", async () => {
    const { container, getByText, getByTestId } = renderWithProdo(
      <App />,
      model.createStore({ initState }),
    );

    expect(getByTestId("list").textContent).toContain("milk");
    fireEvent.click(getByText("delete all"));

    await waitForDomChange({ container });
    expect(getByTestId("list").textContent).toBe("");
  });

  it("add an item", async () => {
    const { container, getByLabelText, getByTestId } = renderWithProdo(
      <App />,
      model.createStore({
        initState,
        mockEffects: {
          randomId: ["T2"],
        },
      }),
    );

    const input = getByLabelText("item-input");
    expect(getByTestId("list").textContent).toBe("milkx");

    fireEvent.change(input, { target: { value: "hello world" } });
    fireEvent.keyUp(input, {
      key: "Enter",
      keyCode: 13,
    });

    await waitForDomChange({ container });

    expect(getByTestId("list").textContent).toContain("hello world");
  });
});
