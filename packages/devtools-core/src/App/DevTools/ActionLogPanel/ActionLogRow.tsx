import * as React from "react";
import styled from "styled-components";
import { paddings } from "../../../styles";
import { Action } from "../../../types";
import JsonTree from "../components/JsonTree";

const StyledActionLogRow = styled.div`
  padding-bottom: ${paddings.medium};
`;

const StyledSummary = styled.summary<{ dim?: boolean }>`
  cursor: pointer;
  ${props => props.dim && "opacity: 50%;"}
  &:hover {
    color: ${props => props.theme.colors.accent};
  }
`;

const ActionId = styled.span`
  color: black;
  font-weight: bold;
  margin-right: 3px;
  background: grey;
  border-radius: 10px;
  padding-left: 1px;
  padding-right: 1px;
`;

const ActionParentId = styled.span`
  color: white;
  font-size: 70%;
`;

const ActionName = styled.span`
  color: ${props => props.theme.colors.accent};
  padding-right: 3px;
`;

const ActionComponent = styled.span`
  color: rgb(230, 232, 117);
  padding-right: 3px;
`;

const ActionArgs = styled.span`
  color: ${props => props.theme.colors.accent};
`;

const ActionLogRowContents = styled.div`
  padding-left: 18px;
  padding-top: ${paddings.small};
  font-size: ${props => props.theme.fontSizes.code};
`;

const RestyledJson = styled.div`
  background: #3d434d82;
  padding: 8px;
  margin: 4px;
`;

const Section = ({
  name,
  value,
  dim,
}: {
  name: string;
  value: any;
  dim?: boolean;
}) => (
  <details>
    <StyledSummary dim={dim}>{name}</StyledSummary>
    <RestyledJson>
      <JsonTree value={value} readOnly={true} />
    </RestyledJson>
  </details>
);

export const ActionLogRow = ({ action }: { action: Action }) => {
  // @ts-ignore
  const { _id, _parentId, _component } = action;
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
          {_parentId && <ActionParentId>{_parentId} → </ActionParentId>}
          <ActionId>&nbsp;{_id}&nbsp;</ActionId>
          <ActionComponent>{_component}:</ActionComponent>
          <ActionName>{action.actionName}</ActionName>
          <ActionArgs>
            ({action.args.map((x: any) => JSON.stringify(x)).join(",")})
          </ActionArgs>
        </StyledSummary>
        <ActionLogRowContents
          className="actionLogRowContents"
          data-testid="actionLogRowContents"
        >
          {/* <Section name={"Prev"} value={action.prevUniverse} />
          {action.nextUniverse && (
            <Section name={"Next"} value={action.nextUniverse} />
          )} */}
          {action.patches && action.patches.length > 0 && (
            <Section
              name={`Patches (${action.patches.length})`}
              value={action.patches}
            />
          )}

          {action.recordedEffects && action.recordedEffects.length > 0 && (
            <Section
              name={`Effects (${action.recordedEffects.length})`}
              value={action.recordedEffects}
            />
          )}
          {action.nextActions.length > 0 && (
            <Section
              name={`Dispatch (${action.nextActions.length})`}
              value={action.nextActions}
            />
          )}
          {rerenders.length > 0 && (
            <Section name={`Renders (${rerenders.length})`} value={rerenders} />
          )}
          <Section
            name={"Details"}
            dim={true}
            value={{
              args: action.args,
              prevState: action.prevUniverse,
              nextState: action.nextUniverse,
            }}
          />
        </ActionLogRowContents>
      </details>
    </StyledActionLogRow>
  );
};
