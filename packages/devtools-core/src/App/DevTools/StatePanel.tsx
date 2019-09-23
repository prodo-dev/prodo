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

  return (
    <StyledStatePanel className="statePanel" data-testid="statePanel">
      <JsonTree
        value={watch(state.app.state)}
        onDeltaUpdate={onDeltaStateUpdate}
        readOnly={false}
      />
    </StyledStatePanel>
  );
};
