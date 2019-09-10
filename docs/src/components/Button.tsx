import * as React from "react";
import styled from "styled-components";
import { EmptyLink } from "./Link";

const Button = styled.button`
  appearance: none;
  display: inline-block;
  margin: 0.15rem;
  padding: 0.4rem;
  height: 2.5rem;
  min-width: 8rem;
  background-color: ${props => props.theme.colours.primary};
  border: none;
  color: white;
  border-radius: 2px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
`;

export default Button;

const AnyButton = Button as any;
export const ButtonLink: React.FC<{ to: string }> = props => (
  <AnyButton as={EmptyLink} to={props.to}>
    {props.children}
  </AnyButton>
);
