import * as React from "react";
import { state, watch } from "../../../model";
import { Action } from "../../../types";
import { ActionLogRow } from "./ActionLogRow";

export const ActionLogPanel = () => {
  const actions = state ? watch(state.app.actionLog) : [];

  return (
    <div>
      {actions.length === 0
        ? "Action log is empty."
        : actions.map((action: Action, index: number) => (
            <ActionLogRow action={action} key={index} />
          ))}
    </div>
  );
};
