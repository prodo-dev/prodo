import * as React from "react";
import styled from "styled-components";

interface Props {
  up: boolean;
}

const StyledCaret = styled.span<Props>`
  user-select: none;
  transform-origin: center center;
  transform: rotate(${props => (props.up ? "0deg" : "180deg")});
  transition: transform 100ms ease-in-out;
`;

const Caret: React.FC<Props> = props => <StyledCaret {...props}>⌃</StyledCaret>;

export default Caret;
