import { Location } from "@reach/router";
import { Link as GLink } from "gatsby";
import * as path from "path-browserify";
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
  target?: string;
}

const isExternalLink = (href: string): boolean =>
  href.startsWith("http://") || href.startsWith("https://");

const isFileLink = (href: string): boolean => /^\/\d/.test(href);

const isHashLink = (href: string): boolean => href.startsWith("#");

const isRelativeLink = (href: string): boolean => /^\.\.?/.test(href);

const sectionLinkRegex = new RegExp(/^\/\d+\_/);
const isSectionLink = (href: string): boolean => sectionLinkRegex.test(href);

const removeExtension = (s: string): string => {
  const parsed = path.parse(s);
  return `${path.join(parsed.dir, parsed.name)}`;
};

const reWriteRelativeLink = (pathname: string, href: string): string => {
  if (isSectionLink(href)) {
    const newHref = removeExtension(href.replace(sectionLinkRegex, ""));
    return newHref;
  }

  if (isRelativeLink(href)) {
    const newHref = path.join(path.dirname(pathname), href);
    return reWriteRelativeLink(pathname, newHref);
  }

  if (isHashLink(href)) {
    return `${pathname}${href}`;
  }

  if (isFileLink(href)) {
    const parts = href.split(path.sep);
    parts.shift();
    parts.shift();

    const newHref = `./${removeExtension(parts.join(path.sep))}`;

    const rewritten = reWriteRelativeLink(pathname, newHref);
    return rewritten;
  }

  return href;
};

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

export const MdxLink: React.FC<any> = props => {
  return (
    <Location>
      {({ location }) => {
        return (
          <Link
            {...{
              ...props,
              href: reWriteRelativeLink(location.pathname, props.href!),
            }}
          />
        );
      }}
    </Location>
  );
};
