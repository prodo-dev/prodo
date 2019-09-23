import * as React from "react";
import styled from "styled-components";
import { paddings } from "../../../styles";

const StyledRenderLogRow = styled.div`
  padding-bottom: ${paddings.medium};
`;

export const RenderLogRow = ({
  componentId,
  renders,
}: {
  componentId: string;
  renders: { total: number };
}) => (
  <StyledRenderLogRow className="renderLogRow" data-testid="renderLogRow">
    {componentId} rendered {renders.total} times.
    {Object.keys(renders).map(
      actionName =>
        actionName !== "total" && (
          <div key={actionName}>
            - {renders[actionName]} times by {actionName}
          </div>
        ),
    )}
  </StyledRenderLogRow>
);
