import * as React from "react";
import styled from "styled-components";
import { state, watch } from "../../model";
import { sendMessage } from "../../utils/communication";
import JsonTree from "./components/JsonTree";

const StyledStatePanel = styled.div`
  font-size: ${props => props.theme.fontSizes.code};
`;

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
      {editableState && (
        <JsonTree
          value={editableState}
          onDeltaUpdate={onDeltaStateUpdate}
          readOnly={false}
        />
      )}
      {Object.keys(readOnlyState).length > 0 && (
        <>
          <h3>Plugin states</h3>
          <JsonTree value={readOnlyState} readOnly={true} />
        </>
      )}
    </StyledStatePanel>
  );
};
