import * as React from "react";
import styled from "styled-components";
import { eventListener } from "../communication";
import { dispatch } from "../model";
import { Panel } from "../types";
import { ActionLogPanel } from "./ActionLogPanel";
import { StatePanel } from "./StatePanel";

const panels: { [key in Panel]: React.ReactElement } = {
  state: <StatePanel />,
  actionLog: <ActionLogPanel />,
};

const StyledDevtools = styled.div`
  display: flex;
  flex-direction: column;

  width: 500px;
  padding: 1rem;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-around;
`;

export const DevTools = () => {
  React.useEffect(() => {
    window.addEventListener("message", eventListener(dispatch));
    return () => window.removeEventListener("message", eventListener(dispatch));
  }, []);

  const [selectedPanel, setSelectedPanel] = React.useState("state" as Panel);

  return (
    <StyledDevtools>
      <h1>DevTools</h1>
      <Tabs>
        <h2 onClick={() => setSelectedPanel("state")}>State</h2>
        <h2 onClick={() => setSelectedPanel("actionLog")}>Action Log</h2>
      </Tabs>
      {panels[selectedPanel]}
    </StyledDevtools>
  );
};
