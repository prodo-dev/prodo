import { Link as GLink } from "gatsby";
import * as React from "react";
import styled from "styled-components";

const StyledLink = styled(GLink)<{ empty: number }>`
  color: ${props => (props.empty ? "inherit" : props.theme.colours.accent)};
  text-decoration: none;
  transition: opacity 150ms ease-in-out;

  &:hover {
    text-decoration: none;
    opacity: 0.6;
  }
` as any;

export interface Props {
  to: string;
  href?: string;
  empty?: boolean;
}

const isExternalLink = (href: string): boolean =>
  href.startsWith("http://") || href.startsWith("https://");

const Link: React.FC<Props> = props => {
  const href = props.href || props.to;
  if (isExternalLink(href)) {
    return (
      <StyledLink
        as="a"
        href={href}
        {...{ ...props, empty: props.empty ? 1 : 0 }}
      >
        {props.children}
      </StyledLink>
    );
  }

  return (
    <StyledLink to={href} {...{ ...props, empty: props.empty ? 1 : 0 }}>
      {props.children}
    </StyledLink>
  );
};

export default Link;

export const EmptyLink: React.FC<Props> = props => (
  <Link empty={true} {...props} />
);
