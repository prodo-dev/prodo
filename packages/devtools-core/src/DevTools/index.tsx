import * as React from "react";
import styled from "styled-components";
import { Panel } from "../types";
import ActionLogPanel from "./ActionLogPanel";
import { StatePanel } from "./StatePanel";

const panels: { [key in Panel]: React.ReactElement } = {
  state: <StatePanel />,
  actions: <ActionLogPanel />,
};

const StyledDevtools = styled.div`
  display: flex;
  flex-direction: column;

  width: 30%;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-around;
`;

export const DevTools = () => {
  const [selectedPanel, setSelectedPanel] = React.useState("state" as Panel);

  return (
    <StyledDevtools>
      <h1>DevTools</h1>
      <Tabs>
        <h2 onClick={() => setSelectedPanel("state")}>State</h2>
        <h2 onClick={() => setSelectedPanel("actions")}>Actions</h2>
      </Tabs>
      {panels[selectedPanel]}
    </StyledDevtools>
  );
};
