import * as React from "react";
import styled from "styled-components";
import { dispatch, state } from "../../../model";
import { margins, paddings } from "../../../styles";

export const clearLogs = () => {
  state.app.actionLog = [];
  state.app.renderLog = [];
};

const StyledButton = styled.button`
  padding: ${paddings.small};
  margin: ${margins.small};
  background-color: ${props => props.theme.colors.bg};
  color: ${props => props.theme.colors.fg}
  border: white solid 1px;
  border-radius: 4px;

  cursor: pointer;
  &:hover {
    color: ${props => props.theme.colors.accent};
  }

  width: 100px;
  align-self: end;
`;

export const ClearLogsButton = () => (
  <StyledButton
    onClick={() => dispatch(clearLogs)()}
    className="clearLogsButton"
    data-testid="clearLogsButton"
  >
    Clear logs
  </StyledButton>
);
