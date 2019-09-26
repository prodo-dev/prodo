import * as React from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import styled from "styled-components";
import { dispatch } from "../../model";
import { HeaderHeight, paddings, PanelWidth } from "../../styles";
import { Panel } from "../../types";
import { eventListener } from "../../utils/communication";
import { ActionLogPanel } from "./ActionLogPanel";
import { RenderLogPanel } from "./RenderLogPanel";
import { StatePanel } from "./StatePanel";

const panels: { [key in Panel]: React.ReactElement } = {
  state: <StatePanel />,
  actionLog: <ActionLogPanel />,
  renderLog: <RenderLogPanel />,
};

const StyledDevtools = styled.div`
  min-height: 100vh;
  width: ${PanelWidth};

  display: flex;
  flex-direction: column;

  background-color: ${props => props.theme.colors.bg};
  color: ${props => props.theme.colors.fg};
`;

const Tabs = styled.div`
  height: ${HeaderHeight};

  display: flex;
  justify-content: space-around;

  border-bottom: 1px solid ${props => props.theme.colors.fg};

  cursor: pointer;
`;

const Tab = styled.div<{ isSelected: boolean }>`
  padding: ${paddings.small};
  ${props => props.isSelected && `font-weight: bold`};

  &:hover {
    color: ${props => props.theme.colors.accent};
  }
`;

const StyledPanel = styled.div`
  padding: ${paddings.medium};
`;

const StyledScroll = styled(ScrollToBottom)`
  .scroll-to-bottom-view {
    min-height: calc(100vh - ${HeaderHeight});
    max-height: calc(100vh - ${HeaderHeight});
  }
`;

export const DevTools = () => {
  React.useEffect(() => {
    window.addEventListener("message", eventListener(dispatch));
    return () => window.removeEventListener("message", eventListener(dispatch));
  }, []);

  const [selectedPanel, setSelectedPanel] = React.useState("state" as Panel);

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
      <StyledScroll
        scrollViewClassName="scroll-to-bottom-view"
        followButtonClassName="scroll-to-bottom-button"
      >
        <StyledPanel>{panels[selectedPanel]}</StyledPanel>
      </StyledScroll>
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
      .join(" Log")
  );
};
