import { render } from "@testing-library/react";
import * as React from "react";
import { model } from "../../src/model";

export default (
  ui: React.ReactElement,
  config: Parameters<typeof model.createStore>[0],
) => {
  const { store, Provider } = model.createStore(config);
  return {
    ...render(<Provider>{ui}</Provider>),
    store,
  };
};
