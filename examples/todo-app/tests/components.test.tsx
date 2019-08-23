import * as React from "react";
import { Provider } from "@prodo/core";
import { render, fireEvent } from "@testing-library/react";
import { initState, model, State } from "../src/store";
import App, { Item } from "../src/App";

const renderWithProdo = (ui: React.ReactElement, initState: State) => {
  const store = model.createStore({ initState });
  return {
    ...render(<Provider value={store}>{ui}</Provider>),
    store,
  };
};

describe("components", () => {
  it("can render with initial store", async () => {
    const { getByTestId, findAllByTestId } = renderWithProdo(
      <App />,
      initState,
    );

    expect(getByTestId("list").textContent).toContain("milk");
    expect(await findAllByTestId("item")).toHaveLength(1);
  });

  it("can render specific item", async () => {
    const { getByTestId } = renderWithProdo(<Item id="T2" />, {
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
    });
    expect(getByTestId("item").textContent).toEqual("twox");
  });

  it("can render with empty store", async () => {
    const { getByTestId } = renderWithProdo(<App />, {
      todos: {},
    });
    expect(getByTestId("list").textContent).toBe("");
  });

  it("can render with store with multiple items", async () => {
    const { findAllByTestId } = renderWithProdo(<App />, {
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
    });

    expect(await findAllByTestId("item")).toHaveLength(3);
  });

  it("delete all items", () => {
    const { getByText, getByTestId } = renderWithProdo(<App />, initState);

    expect(getByTestId("list").textContent).toContain("milk");
    fireEvent.click(getByText("delete all"));
    expect(getByTestId("list").textContent).toContain("");
  });

  it("add an item", async () => {
    const { getByLabelText, getByTestId } = renderWithProdo(<App />, initState);
    const input = getByLabelText("item-input");
    expect(getByTestId("list").textContent).toBe("milkx");

    fireEvent.change(input, { target: { value: "hello world" } });
    fireEvent.keyUp(input, {
      key: "Enter",
      keyCode: 13,
    });

    await new Promise(r => setTimeout(r, 0));
    expect((await getByTestId("list")).textContent).toContain("hello world");
  });
});
