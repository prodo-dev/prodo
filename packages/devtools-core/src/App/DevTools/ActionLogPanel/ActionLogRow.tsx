import * as React from "react";
import styled from "styled-components";
import { paddings } from "../../../styles";
import { Action } from "../../../types";
import JsonTree from "../components/JsonTree";

const StyledActionLogRow = styled.div`
  padding-bottom: ${paddings.medium};
`;

export const ActionLogRow = ({ action }: { action: Action }) => {
  return (
    <StyledActionLogRow className="actionLogRow" data-testid="actionLogRow">
      <details>
        <summary
          className="actionLogRowHeader"
          data-testid="actionLogRowHeader"
        >
          {action.actionName}
        </summary>
        <JsonTree value={action} readOnly={true} />
      </details>
    </StyledActionLogRow>
  );
};
