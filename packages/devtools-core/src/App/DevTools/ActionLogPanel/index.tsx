import * as React from "react";
import { state, watch } from "../../../model";
import { Action } from "../../../types";
import { ActionLogRow } from "./ActionLogRow";

export const emptyActionLogMessage = "Action log is empty.";

export const ActionLogPanel = () => {
  const actions = watch(state.app.actionLog);

  return (
    <div className="actionLogPanel" data-testid="actionLogPanel">
      {actions.length === 0
        ? emptyActionLogMessage
        : actions.map((action: Action, index: number) => (
            <ActionLogRow action={action} key={index} />
          ))}
    </div>
  );
};
