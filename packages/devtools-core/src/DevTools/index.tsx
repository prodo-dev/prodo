import * as React from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import styled from "styled-components";
import { dispatch } from "../model";
import { Panel } from "../types";
import { eventListener } from "../utils/communication";
import { ActionLogPanel } from "./ActionLogPanel";
import { StatePanel } from "./StatePanel";

const panels: { [key in Panel]: React.ReactElement } = {
  state: <StatePanel />,
  actionLog: <ActionLogPanel />,
};

const StyledDevtools = styled.div`
  min-height: 100vh;
  width: 500px;

  display: flex;
  flex-direction: column;

  background-color: #282c34;
  color: white;
`;

const HeaderHeight = "35px";

const Tabs = styled.div`
  height: ${HeaderHeight};

  display: flex;
  justify-content: space-around;

  border-bottom: 1px solid white;
`;

const Tab = styled.div<{ isSelected: boolean }>`
  padding: 0.5rem;
  ${props => props.isSelected && `font-weight: bold`};
`;

const StyledPanel = styled.div`
  padding: 1rem;
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
    <StyledDevtools>
      <Tabs>
        <Tab
          isSelected={selectedPanel === "state"}
          onClick={() => setSelectedPanel("state")}
        >
          State
        </Tab>
        <Tab
          isSelected={selectedPanel === "actionLog"}
          onClick={() => setSelectedPanel("actionLog")}
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
