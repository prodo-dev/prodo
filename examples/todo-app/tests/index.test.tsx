import * as React from "react";
import { fireEvent } from "@testing-library/react";
import { renderWithProdo } from "./utils";
import { initialState } from "../src/store";
import App, { Item } from "../src/App";

test("can render with initial store", async () => {
  const { getByTestId, findAllByTestId } = renderWithProdo(<App />, {
    initialState,
  });
  expect(getByTestId("list").textContent).toContain("milk");
  expect(await findAllByTestId("item")).toHaveLength(1);
});

test("can render specific item", async () => {
  const { getByTestId } = renderWithProdo(<Item id="T2" />, {
    initialState: {
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
  });
  expect(getByTestId("item").textContent).toEqual("twox");
});

test("can render with empty store", async () => {
  const { getByTestId } = renderWithProdo(<App />, {
    initialState: {
      todos: {},
    },
  });
  expect(getByTestId("list").textContent).toBe("");
});

test("can render with store with multiple items", async () => {
  const { findAllByTestId } = renderWithProdo(<App />, {
    initialState: {
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
  });

  expect(await findAllByTestId("item")).toHaveLength(3);
});

test("delete all items", () => {
  const { getByText, getByTestId } = renderWithProdo(<App />, { initialState });
  fireEvent.click(getByText("delete all"));
  expect(getByTestId("list").textContent).toContain("");
});

test("add an item", async () => {
  const { getByLabelText, getByTestId } = renderWithProdo(<App />, {
    initialState,
  });
  const input = getByLabelText("item-input");
  expect(getByTestId("list").textContent).toBe("milkx");

  fireEvent.change(input, { target: { value: "hello world" } });
  fireEvent.keyUp(input, {
    key: "Enter",
    keyCode: 13,
  });

  expect((await getByTestId("list")).textContent).toContain("hello world");
});
