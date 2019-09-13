import * as React from "react";
import styled from "styled-components";
import { EmptyLink } from "./Link";

export interface Props {
  primary?: boolean;
}

const Button = styled.button<Props>`
  appearance: none;
  display: inline-block;
  margin: 0.15rem;
  padding: 0.4rem;
  height: 2.5rem;
  min-width: 8rem;
  background-color: ${props =>
    props.primary ? props.theme.colours.primary : "#a6a6a6"};
  border: none;
  color: white;
  border-radius: 2px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
`;

export default Button;

const AnyButton = Button as any;
export const ButtonLink: React.FC<{ to: string } & Props> = props => (
  <EmptyLink to={props.to}>
    <AnyButton {...props}>{props.children}</AnyButton>
  </EmptyLink>
);
