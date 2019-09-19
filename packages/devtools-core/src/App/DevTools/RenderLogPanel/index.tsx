import * as _ from "lodash";
import * as React from "react";
import { state, watch } from "../../../model";
import { RenderLogRow } from "./RenderLogRow";

export const emptyRenderLogMessage = "Render log is empty.";

export const RenderLogPanel = () => {
  const actions = watch(state.app.actionLog);
  const rerenders = _.flatMap(
    actions.map(action =>
      action.rerender
        ? Object.keys(action.rerender!).filter(comp => action.rerender![comp])
        : [],
    ),
  ).filter(rerender => rerender);

  return (
    <div className="renderLogPanel" data-testid="renderLogPanel">
      {rerenders.length === 0
        ? emptyRenderLogMessage
        : rerenders.map((render: string, index: number) => (
            <RenderLogRow render={render} key={index} />
          ))}
    </div>
  );
};
