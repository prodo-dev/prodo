import "@babel/polyfill";
import * as _ from "lodash";
import * as React from "react";
import {
  emptyRenderLogMessage,
  RenderLogPanel,
} from "../../../../src/App/DevTools/RenderLogPanel";
import { model } from "../../../../src/model";
import { initState } from "../../../../src/store";
import { populatedState } from "../../../fixtures";
import { renderWithProdo } from "../../../utils";

describe("RenderLogPanel", () => {
  it("is empty when there is no renders", async () => {
    const { getByTestId, queryByTestId } = renderWithProdo(
      <RenderLogPanel />,
      model.createStore({ initState }),
    );

    expect(getByTestId("renderLogPanel").textContent).toBe(
      emptyRenderLogMessage,
    );

    expect(queryByTestId("clearLogsButton")).toBeNull();
  });

  it("renders all renders in the log", async () => {
    const { findAllByTestId, getByTestId } = renderWithProdo(
      <RenderLogPanel />,
      model.createStore({ initState: populatedState }),
    );

    const components = _.uniq(
      populatedState.app.renderLog.map(entry => entry.componentId),
    );
    expect(await findAllByTestId("renderLogRow")).toHaveLength(
      components.length,
    );

    expect(getByTestId("clearLogsButton")).toBeTruthy;
  });
});
