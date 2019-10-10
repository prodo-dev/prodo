import * as React from "react";
import styled from "styled-components";
import { state, watch } from "../../model";
import { margins } from "../../styles";
import { sendMessage } from "../../utils/communication";
import JsonTree from "./components/JsonTree";

const StyledStatePanel = styled.div`
  font-size: ${props => props.theme.fontSizes.code};
`;

const Info = styled.span`
  color: grey;
  font-weight: normal;
`;

const SectionTitle = styled.h3<{ skipTopMargin?: boolean }>`
  ${props => props.skipTopMargin && `margin-top: ${margins.none};`}
`;

export const emptyStateMessage = "App state is empty.";

export const StatePanel = () => {
  const onDeltaStateUpdate = ({
    key,
    keyPath,
    newValue,
    oldValue,
  }: {
    key: string;
    keyPath: string[];
    newValue: any;
    oldValue: any;
  }) => {
    const path = keyPath.concat([key]);
    if (oldValue !== newValue) {
      sendMessage({ type: "updateState", contents: { path, newValue } });
    }
  };

  const { state: editableState, ...readOnlyState } = watch(state.app.universe);

  return (
    <StyledStatePanel className="statePanel" data-testid="statePanel">
      {editableState && Object.keys(editableState).length > 0 ? (
        <>
          {Object.keys(readOnlyState).length > 0 && (
            <SectionTitle skipTopMargin>
              App State <Info>(editable)</Info>
            </SectionTitle>
          )}
          <JsonTree
            value={editableState}
            onDeltaUpdate={onDeltaStateUpdate}
            readOnly={false}
          />
        </>
      ) : (
        <SectionTitle skipTopMargin>{emptyStateMessage}</SectionTitle>
      )}
      {Object.keys(readOnlyState).length > 0 && (
        <>
          <SectionTitle>Plugin State</SectionTitle>
          <JsonTree value={readOnlyState} readOnly={true} />
        </>
      )}
    </StyledStatePanel>
  );
};
