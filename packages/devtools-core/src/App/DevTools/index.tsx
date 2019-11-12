import * as React from "react";
import styled from "styled-components";
import { dispatch, watch, state } from "../../model";
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
  width: ${PanelWidth};
  min-height: 100vh;
  max-height: 100vh;

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
  overflow: auto;
  padding: ${paddings.medium};
  min-height: calc(100vh - ${HeaderHeight});
  max-height: calc(100vh - ${HeaderHeight});
`;

const RecordButtons = styled.div`
  position: absolute;
  bottom: 5px;
  right: 5px;
`;

function post({ func, universe, actionLog }: any) {
  const name = prompt("Name:");
  // @ts-ignore
  const { port } = window.devtoolsServer;
  fetch(`http://localhost:${port}/${func}`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ universe, actionLog, name }),
  })
    .then(res => res.json())
    .then(res => console.log(res));
}

const ServerActions = () => {
  // @ts-ignore
  const { buttons } = window.devtoolsServer;
  console.log({ ServerActions, buttons });
  const universe = watch(state.app.universe);
  const actionLog = watch(state.app.actionLog);
  return (
    <RecordButtons>
      {Object.keys(buttons).map(func => (
        <button onClick={() => post({ func, universe, actionLog })}>
          {buttons[func]}
        </button>
      ))}
    </RecordButtons>
  );
};

export const DevTools = () => {
  React.useEffect(() => {
    window.addEventListener("message", eventListener(dispatch));
    return () => window.removeEventListener("message", eventListener(dispatch));
  }, []);

  const [selectedPanel, setSelectedPanel] = React.useState("state" as Panel);
  // @ts-ignore
  const hasServer = !!window.devtoolsServer;
  console.log({ hasServer });

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
      .join(" Log")
  );
};
