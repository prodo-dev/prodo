import * as React from "react";
import styled from "styled-components";
import { state, watch } from "../../model";
import { margins, paddings } from "../../styles";

const RecordButtons = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
`;

const Button = styled.div`
  cursor: pointer;
  padding: ${paddings.small};
  margin-left: ${margins.small};
  background-color: ${props => props.theme.colors.detail};
  &:hover {
    color: ${props => props.theme.colors.accent};
  }
`;

export function post({ func, universe, actionLog }: any) {
  const name = prompt("Enter the name for your test:");
  const { port } = (window as any).devtoolsServer;
  fetch(`http://localhost:${port}/${func}`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ universe, actionLog, name }),
  })
    .then(res => res.json())
    .then(res =>
      alert(
        res.success
          ? `File saved succesfully: ${res.testFileName}`
          : `Error: ${res.error}`,
      ),
    );
}

export const ServerActions = () => {
  const { buttons } = (window as any).devtoolsServer;
  const universe = watch(state.app.universe);
  const actionLog = watch(state.app.actionLog);
  return (
    <RecordButtons>
      {Object.keys(buttons).map((func, index) => (
        <Button onClick={() => post({ func, universe, actionLog })} key={index}>
          {buttons[func]}
        </Button>
      ))}
    </RecordButtons>
  );
};
