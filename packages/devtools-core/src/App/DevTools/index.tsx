import * as React from "react";
import styled from "styled-components";
import { dispatch } from "../../model";
import { HeaderHeight, paddings, PanelWidth } from "../../styles";
import { Panel } from "../../types";
import { eventListener } from "../../utils/communication";
import { ActionLogPanel } from "./ActionLogPanel";
import { ServerActions } from "./recordingTests";
import { RenderLogPanel } from "./RenderLogPanel";
import { StatePanel } from "./StatePanel";

const panels: { [key in Panel]: React.ReactElement } = {
  state: <StatePanel />,
  actionLog: <ActionLogPanel />,
  renderLog: <RenderLogPanel />,
};

const StyledDevtools = styled.div`
  width: ${PanelWidth};
  min-height: 100vh;
  max-height: 100vh;

  display: flex;
  flex-direction: column;

  background-color: ${props => props.theme.colors.bg};
  color: ${props => props.theme.colors.fg};
  font-size: ${props => props.theme.fontSizes.normal};
`;

const Tabs = styled.div`
  height: ${HeaderHeight};
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.detail};
  cursor: pointer;
`;

const Tab = styled.div<{ isSelected: boolean }>`
  border-right: 1px solid ${props => props.theme.colors.detail};
  padding: ${paddings.small} ${paddings.small} ${paddings.tiny}
    ${paddings.small};
  ${props =>
    props.isSelected && `background-color: ${props.theme.colors.detail};`}

  &:hover {
    color: ${props => props.theme.colors.accent};
  }
`;

const StyledPanel = styled.div`
  overflow: auto;
  padding: ${paddings.medium};
  min-height: calc(100vh - ${HeaderHeight});
  max-height: calc(100vh - ${HeaderHeight});
`;

export const DevTools = () => {
  React.useEffect(() => {
    window.addEventListener("message", eventListener(dispatch));
    return () => window.removeEventListener("message", eventListener(dispatch));
  }, []);

  const [selectedPanel, setSelectedPanel] = React.useState("state" as Panel);
  const hasServer = !!(window as any).devtoolsServer;

  // TODO: bring back scroll-to-bottom?
  return (
    <StyledDevtools className="devTools" data-testid="devTools">
      <Tabs className="headerTabs" data-testid="headerTabs">
        {Object.keys(panels).map(panel => (
          <Tab
            isSelected={selectedPanel === panel}
            onClick={() => setSelectedPanel(panel as Panel)}
            className={`${panel}HeaderTab`}
            data-testid={`${panel}HeaderTab`}
            key={panel}
          >
            {getPanelTitle(panel)}
          </Tab>
        ))}
      </Tabs>
      <StyledPanel>{panels[selectedPanel]}</StyledPanel>
      {hasServer && <ServerActions />}
    </StyledDevtools>
  );
};

// Title-cases and spaces panel name, eg. actionLog => Action Log
const getPanelTitle = (data: string) => {
  return (
    data.charAt(0).toUpperCase() +
    data
      .slice(1)
      .split("Log")
      .join(" log")
  );
};
