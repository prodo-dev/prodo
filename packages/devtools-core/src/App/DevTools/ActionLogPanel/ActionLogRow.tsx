import * as React from "react";
import styled from "styled-components";
import { paddings } from "../../../styles";
import { Action } from "../../../types";
import JsonTree from "../components/JsonTree";

const StyledActionLogRow = styled.div`
  padding-bottom: ${paddings.medium};
`;

const ActionLogRowHeader = styled.span`
  cursor: pointer;
  &:hover {
    color: ${props => props.theme.colors.accent};
  }
`;

export const ActionLogRow = ({ action }: { action: Action }) => {
  return (
    <StyledActionLogRow className="actionLogRow" data-testid="actionLogRow">
      <details>
        <summary
          className="actionLogRowHeader"
          data-testid="actionLogRowHeader"
        >
          <ActionLogRowHeader>{action.actionName}</ActionLogRowHeader>
        </summary>
        <div
          className="actionLogRowContents"
          data-testid="actionLogRowContents"
        >
          <JsonTree value={action} readOnly={true} />
        </div>
      </details>
    </StyledActionLogRow>
  );
};
