import * as React from "react";
import styled from "styled-components";
import { paddings } from "../../../styles";
import { Action } from "../../../types";
import JsonTree from "../components/JsonTree";

const StyledActionLogRow = styled.div`
  padding-bottom: ${paddings.medium};
`;

const StyledSummary = styled.summary`
  cursor: pointer;
  &:hover {
    color: ${props => props.theme.colors.accent};
  }
`;

const ActionLogRowContents = styled.div`
  padding-left: ${paddings.medium};
  padding-top: ${paddings.small};
  font-size: ${props => props.theme.fontSizes.code};
`;

const Section = ({ name, value }: { name: string; value: any }) => (
  <details>
    <StyledSummary>{name}</StyledSummary>
    <JsonTree value={value} readOnly={true} />
  </details>
);

export const ActionLogRow = ({ action }: { action: Action }) => {
  const rerenders = action.rerender
    ? Object.keys(action.rerender).filter(comp => action.rerender![comp])
    : [];
  return (
    <StyledActionLogRow className="actionLogRow" data-testid="actionLogRow">
      <details>
        <StyledSummary
          className="actionLogRowHeader"
          data-testid="actionLogRowHeader"
        >
          {action.actionName} (origin: {action.id}
          {action.parentId && `, parent: ${action.parentId}`})
        </StyledSummary>
        <ActionLogRowContents
          className="actionLogRowContents"
          data-testid="actionLogRowContents"
        >
          <Section name={"Args"} value={action.args} />
          <Section name={"Previous universe"} value={action.prevUniverse} />
          {action.nextUniverse && (
            <Section name={"Next universe"} value={action.nextUniverse} />
          )}
          <Section name={"State patches"} value={action.patches} />
          {action.recordedEffects && action.recordedEffects.length > 0 && (
            <Section name={"Recorded Effects"} value={action.recordedEffects} />
          )}
          {action.nextActions.length > 0 && (
            <div>Next actions: {JSON.stringify(action.nextActions)}</div>
          )}
          {rerenders.length > 0 && (
            <div>Re-render: {JSON.stringify(rerenders)}</div>
          )}
        </ActionLogRowContents>
      </details>
    </StyledActionLogRow>
  );
};
