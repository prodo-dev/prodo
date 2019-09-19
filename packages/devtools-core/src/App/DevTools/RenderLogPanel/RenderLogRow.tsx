import * as React from "react";
import styled from "styled-components";
import { paddings } from "../../../styles";

const StyledRenderLogRow = styled.div`
  padding-bottom: ${paddings.medium};
`;

export const RenderLogRow = ({ render }: { render: string }) => (
  <StyledRenderLogRow className="renderLogRow" data-testid="renderLogRow">
    {render}
  </StyledRenderLogRow>
);
