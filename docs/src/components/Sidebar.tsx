import * as React from "react";
import styled from "styled-components";
import { useStaticQuery, graphql } from "gatsby";
import { SidebarWidth, HeaderHeight, forNarrowScreen } from "../styles";
import { WindowLocation } from "@reach/router";
import { EmptyLink } from "./Link";
import { makeAnchor, removeTrailingSlash } from "../utils";

interface HeadingProps {
  to: string;
  active: number;
}

const HeadingLink = styled(EmptyLink)<HeadingProps>`
  span {
    color: ${props =>
      props.active ? props.theme.colours.primary : props.theme.colours.text};
  }
`;

const StyledPageHeading = styled.div`
  padding-bottom: 0.25rem;
  font-size: 1.5em;
  font-weight: bold;
`;

const PageHeading: React.FC<HeadingProps> = props => (
  <StyledPageHeading>
    <HeadingLink to={props.to} active={props.active}>
      <span>{props.children}</span>
    </HeadingLink>
  </StyledPageHeading>
);

const StyledSubHeading = styled.div`
  font-size: 1em;
`;

const SubHeading: React.FC<HeadingProps> = props => (
  <StyledSubHeading>
    <HeadingLink to={props.to} active={props.active}>
      <span>{props.children}</span>
    </HeadingLink>
  </StyledSubHeading>
);

const StyledSection = styled.div`
  padding-bottom: 1rem;
`;

const Section: React.FC<{
  active: boolean;
  slug: string;
  title: string;
  headings: Array<{
    value: string;
    depth: number;
  }>;
}> = props => {
  return (
    <StyledSection>
      <PageHeading to={props.slug} active={props.active ? 1 : 0}>
        {props.title}
      </PageHeading>
      {props.active &&
        props.headings
          .filter(({ depth }) => depth <= 1)
          .map(({ value }, i) => (
            <SubHeading
              key={i}
              to={`${props.slug}#${makeAnchor(value)}`}
              active={0}
            >
              {value}
            </SubHeading>
          ))}
    </StyledSection>
  );
};

const StyledSidebar = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: ${HeaderHeight}px;
  left: 0;
  bottom: 0;
  min-height: 100vh;
  width: ${SidebarWidth}px;
  max-width: ${SidebarWidth}px;
  padding: 1rem;
  padding-top: 4rem;
  background-color: #eaeaea;
  overflow-y: auto;
  z-index: 9999;

  transition: transform 250ms ease-out;

  ${props => !props.isOpen && forNarrowScreen`transform: translate(-100%);`}
`;

export interface Props {
  isOpen: boolean;
  location: WindowLocation;
}

const Sidebar: React.FC<Props> = props => {
  const data: QueryResult = useStaticQuery(query);
  const pages = data.allMdx.nodes;
  const currentPath = props.location.pathname;

  return (
    <StyledSidebar className="sidebar" isOpen={props.isOpen}>
      {pages.map(node => (
        <Section
          key={node.fields.slug}
          title={node.frontmatter.title}
          headings={node.headings}
          slug={node.fields.slug}
          active={
            removeTrailingSlash(currentPath) ===
            removeTrailingSlash(node.fields.slug)
          }
        />
      ))}
    </StyledSidebar>
  );
};

export default Sidebar;

interface QueryResult {
  allMdx: {
    nodes: Array<{
      fields: {
        slug: string;
      };
      frontmatter: {
        title: string;
      };
      headings: Array<{
        depth: number;
        value: string;
      }>;
    }>;
  };
}

const query = graphql`
  query SidebarQuery {
    allMdx(sort: { fields: [frontmatter___order], order: ASC }) {
      nodes {
        headings {
          value
          depth
        }
        fields {
          slug
        }
        frontmatter {
          title
        }
      }
    }
  }
`;
