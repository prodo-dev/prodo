import * as React from "react";
import { state, watch } from "../model";

export const ActionLogPanel = () => {
  const actions = state ? watch(state.app.actionLog) : [];

  return (
    <div>
      {actions.length === 0
        ? "Action log is empty."
        : actions.map((action: any, index: number) => (
            <div key={index}>
              <b>{action.actionName}</b>
              <div>{JSON.stringify(action)}</div>
              <hr />
            </div>
          ))}
    </div>
  );
};
