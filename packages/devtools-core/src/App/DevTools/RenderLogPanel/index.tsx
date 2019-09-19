import * as _ from "lodash";
import * as React from "react";
import { state, watch } from "../../../model";
import { Render } from "../../../types";
import { RenderLogRow } from "./RenderLogRow";

export const emptyRenderLogMessage = "Render log is empty.";

export const RenderLogPanel = () => {
  const renderLog = watch(state.app.renderLog);

  return (
    <div className="renderLogPanel" data-testid="renderLogPanel">
      {renderLog.length === 0
        ? emptyRenderLogMessage
        : renderLog.map((render: Render, index: number) => (
            <RenderLogRow render={render} key={index} />
          ))}
    </div>
  );
};
