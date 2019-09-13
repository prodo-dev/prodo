import * as React from "react";
import styled from "styled-components";
import { dispatch, state } from "../model";
import { Panel } from "../types";
import { ActionLogPanel } from "./ActionLogPanel";
import { StatePanel } from "./StatePanel";

const recordAction = (action: any) => {
  state.app.actionLog.push(action);
};

// TODO: types
window.addEventListener("message", (event: MessageEvent) => {
  if (event.data.destination === "devtools") {
    if (event.data.type === "completedEvent") {
      // tslint:disable-next-line:no-console
      console.log("Devtools got message", event.data);
      dispatch(recordAction)(event.data.contents);
    }
  }
});

const panels: { [key in Panel]: React.ReactElement } = {
  state: <StatePanel />,
  actionLog: <ActionLogPanel />,
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
        <h2 onClick={() => setSelectedPanel("actionLog")}>Action Log</h2>
      </Tabs>
      {panels[selectedPanel]}
    </StyledDevtools>
  );
};
