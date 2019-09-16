import * as React from "react";
import styled from "styled-components";
import { Action } from "../../types";
import JsonTree from "../components/JsonTree";

const StyledActionLogRow = styled.div`
  padding-bottom: 1rem;
`;

export const ActionLogRow = ({ action }: { action: Action }) => {
  return (
    <StyledActionLogRow>
      <details>
        <summary>{action.actionName}</summary>
        <JsonTree value={action} readOnly={true} />
      </details>
    </StyledActionLogRow>
  );
};
