import { render } from "@testing-library/react";
import * as React from "react";
import App from "../src/components/App";
import { model } from "../src/model";
import { initState } from "./fixtures";
import "@babel/polyfill";

describe("components", () => {
  it("can render with initial store", async () => {
    const { Provider } = model.createStore({ initState });
    render(
      <Provider>
        <App />
      </Provider>,
    );
  });
});
