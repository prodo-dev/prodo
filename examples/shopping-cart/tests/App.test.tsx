import { render } from "@testing-library/react";
import * as React from "react";
import App from "../src/App";
import { model } from "../src/model";
import { createMemoryHistory } from "history";

describe("App", () => {
  it("can render App without crashing", async () => {
    const { Provider } = model.createStore({
      route: {
        history: createMemoryHistory(),
      },
      initState: {
        carts: [],
        products: [],
        total: 0
      },
    });

    render(
      <Provider>
        <App />
      </Provider>,
    );
  });
});
