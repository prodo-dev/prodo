import * as React from "react";
import styled from "styled-components";
import { state, watch } from "../../../model";
import { Action } from "../../../types";
import { ClearLogsButton } from "../components/ClearLogsButton";
import { ActionLogRow } from "./ActionLogRow";

export const emptyActionLogMessage = "Action log is empty.";

const StyledActionLogPanel = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ActionLogPanel = () => {
  const actions = watch(state.app.actionLog);
  addCleanActionIds(actions);
  return (
    <StyledActionLogPanel
      className="actionLogPanel"
      data-testid="actionLogPanel"
    >
      {actions.length === 0 ? (
        emptyActionLogMessage
      ) : (
        <>
          {actions.map((action: Action, index: number) => (
            <ActionLogRow action={action} key={index} />
          ))}
          <ClearLogsButton />
        </>
      )}
    </StyledActionLogPanel>
  );
};

function addCleanActionIds(actions: Action[]) {
  const mapping = {};
  actions.forEach((action, i) => {
    const id = i + 1;
    // @ts-ignore
    action._id = id;
    mapping[action.id] = id;
    // @ts-ignore
    action._parentId = mapping[action.parentId];
    // @ts-ignore
    action._component = action.id.split(".")[0];
  });
}
