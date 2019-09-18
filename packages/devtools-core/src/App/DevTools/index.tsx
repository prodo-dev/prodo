import * as React from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import styled from "styled-components";
import { dispatch } from "../../model";
import { HeaderHeight, paddings, PanelWidth } from "../../styles";
import { Panel } from "../../types";
import { eventListener } from "../../utils/communication";
import { ActionLogPanel } from "./ActionLogPanel";
import { StatePanel } from "./StatePanel";

const panels: { [key in Panel]: React.ReactElement } = {
  state: <StatePanel />,
  actionLog: <ActionLogPanel />,
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
`;

const Tab = styled.div<{ isSelected: boolean }>`
  padding: ${paddings.small};
  ${props => props.isSelected && `font-weight: bold`};
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
        <Tab
          isSelected={selectedPanel === "state"}
          onClick={() => setSelectedPanel("state")}
          className="headerTabState"
          data-testid="headerTabState"
        >
          State
        </Tab>
        <Tab
          isSelected={selectedPanel === "actionLog"}
          onClick={() => setSelectedPanel("actionLog")}
          className="headerTabActionLog"
          data-testid="headerTabActionLog"
        >
          Action Log
        </Tab>
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
