import { Link as GLink } from "gatsby";
import * as React from "react";
import styled from "styled-components";

const StyledGLink = styled(GLink)<{ empty: number }>`
  color: ${props => (props.empty ? "inherit" : props.theme.colours.accent)};
  text-decoration: none;
  transition: opacity 150ms ease-in-out;

  &:hover {
    text-decoration: none;
    opacity: 0.6;
  }
` as any;

const Link: React.FC<{
  empty: number;
  to: string;
}> = props => (
  <StyledGLink {...(props as any)}>
    <span>{props.children}</span>
  </StyledGLink>
);

export default Link;

export const ExternalLink: React.FC<{ to: string }> = props => (
  <StyledGLink as="a" href={props.to}>
    {props.children}
  </StyledGLink>
);

export const EmptyLink: React.FC<{ to: string }> = props => (
  <Link empty={1} {...props} />
);
