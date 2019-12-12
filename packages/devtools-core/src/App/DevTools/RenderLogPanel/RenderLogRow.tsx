import * as React from "react";
import styled from "styled-components";
import { paddings } from "../../../styles";

const StyledRenderLogRow = styled.div`
  padding-bottom: ${paddings.medium};
`;

const CompText = styled.span`
  color: rgb(230, 232, 117);
`;

const ActionText = styled.span`
  color: ${props => props.theme.colors.accent};
`;

const Number = styled.span`
  color: #e86060;
  font-weight: bold;
`;

const ComponentId = ({ name }: { name: string }) => {
  const [main] = name.split(".");
  return <CompText>{main}</CompText>;
};

export const RenderLogRow = ({
  componentId,
  renders,
}: {
  componentId: string;
  renders: { total: number };
}) => (
  <StyledRenderLogRow className="renderLogRow" data-testid="renderLogRow">
    <ComponentId name={componentId} /> rendered <Number>{renders.total}</Number>{" "}
    times.
    {Object.keys(renders).map(
      actionName =>
        actionName !== "total" && (
          <div key={actionName}>
            - <Number>{renders[actionName]}</Number> times by{" "}
            <ActionText>{actionName}</ActionText>
          </div>
        ),
    )}
  </StyledRenderLogRow>
);
