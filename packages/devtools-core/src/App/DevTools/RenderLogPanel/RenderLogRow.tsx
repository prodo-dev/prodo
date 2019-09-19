import * as React from "react";
import styled from "styled-components";
import { paddings } from "../../../styles";
import { Render } from "../../../types";

const StyledRenderLogRow = styled.div`
  padding-bottom: ${paddings.medium};
`;

export const RenderLogRow = ({ render }: { render: Render }) => (
  <StyledRenderLogRow className="renderLogRow" data-testid="renderLogRow">
    {render.componentId} (triggered by {render.actionName})
  </StyledRenderLogRow>
);
