import { WindowLocation } from "@reach/router";
import { graphql, useStaticQuery } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import { forNarrowScreen, HeaderHeight, SidebarWidth } from "../styles";
import { normalize, removeTrailingSlash } from "../utils";
import Caret from "./Caret";
import { EmptyLink } from "./Link";
import Search from "./Search";

interface HeadingProps {
  to: string;
  active: number;
}

interface SubSectionModel {
  id: string;
  section: string;
  title: string;
  slug: string;
  order: number;
}

interface SectionModel {
  title: string;
  slug: string;
  order: number;
  subsections: SubSectionModel[];
}

const getSections = (
  data: QueryResult,
  filter: string[] | null,
): SectionModel[] => {
  const nodes = data.allMdx.nodes;

  const keyedSubSections: { [name: string]: SubSectionModel[] } = nodes.reduce(
    (sections: { [name: string]: SubSectionModel[] }, node) => {
      if (filter != null && !filter.includes(node.id)) {
        return sections;
      }

      return {
        ...sections,
        [node.fields.section]: [
          ...(sections[node.fields.section] || []),
          {
            id: node.id,
            slug: node.fields.slug,
            section: node.fields.section,
            title: node.frontmatter.title,
            order: node.frontmatter.order,
          },
        ],
      };
    },
    {},
  );

  const sections: SectionModel[] = Object.entries(keyedSubSections)
    .map(([sectionName, subsections]) => {
      const order = parseInt(sectionName, 10);
      const normalizedName = sectionName.replace(/^\d+\_/, "").toLowerCase();
      const title = normalize(normalizedName);

      return {
        title,
        slug: "/" + normalizedName,
        order,
        subsections: subsections.sort((a, b) => a.order - b.order),
      };
    })
    .sort((a, b) => a.order - b.order);

  return sections;
};

const SectionHeading = styled.div<{ expanded: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #646464;
  cursor: pointer;
`;

const SectionSubHeading = styled(EmptyLink)<HeadingProps>`
  display: block;
  padding-left: 0.5rem;
  padding-top: 0.25rem;
  color: ${props =>
    props.active
      ? props.theme.colours.sidebar.linkSelected
      : props.theme.colours.sidebar.linkNormal};
  font-size: 1em;

  transition: color 150ms ease-in-out;

  &:hover {
    opacity: 1;
    color: ${props =>
      props.active
        ? props.theme.colours.sidebar.linkSelected
        : props.theme.colours.sidebar.linkHover};
  }
`;

const StyledSection = styled.div<{ active: boolean }>`
  background-color: ${props => props.active && "#f8f8f8"};
  padding: 0.5rem 1rem;
`;

const Section: React.FC<{
  active: boolean;
  searching: boolean;
  section: SectionModel;
  currentPath: string;
}> = ({ active, searching, section, currentPath }) => {
  const [expanded, setExpanded] = React.useState(active);

  React.useEffect(() => {
    setExpanded(searching || active);
  }, [active, searching]);

  return (
    <StyledSection active={active}>
      <SectionHeading
        expanded={expanded}
        onClick={() => setExpanded(!expanded)}
      >
        <span>{section.title}</span> <Caret open={expanded} />
      </SectionHeading>

      {expanded &&
        section.subsections.map(subSection => (
          <SectionSubHeading
            key={subSection.slug}
            to={`${subSection.slug}`}
            active={
              removeTrailingSlash(currentPath) ===
              removeTrailingSlash(subSection.slug)
                ? 1
                : 0
            }
          >
            {subSection.title}
          </SectionSubHeading>
        ))}
    </StyledSection>
  );
};

const StyledSidebar = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: ${HeaderHeight}px;
  left: 0;
  bottom: 0;
  min-height: calc(100vh - ${HeaderHeight}px);
  width: ${SidebarWidth}px;
  max-width: ${SidebarWidth}px;
  background-color: #eaeaea;
  overflow-y: auto;
  z-index: 9999;
  font-size: 0.95em;

  transition: transform 250ms ease-out;

  ${props => !props.isOpen && forNarrowScreen`transform: translate(-100%);`}
`;

const NoResults = styled.p`
  padding: 0 1rem;
`;

export interface Props {
  isOpen: boolean;
  location: WindowLocation;
}

const Sidebar: React.FC<Props> = props => {
  const data: QueryResult = useStaticQuery(query);

  const [isSearching, setIsSearching] = React.useState(false);
  const [results, setResults] = React.useState<string[] | null>(null);

  const currentPath = props.location.pathname;
  const sections = getSections(data, results);

  return (
    <StyledSidebar className="sidebar" isOpen={props.isOpen}>
      <Search
        onSearchResults={results => {
          setResults(results);
          setIsSearching(results !== null);
        }}
      />
      {sections.map(section => (
        <Section
          key={section.slug}
          section={section}
          searching={isSearching}
          active={currentPath.startsWith(section.slug)}
          currentPath={currentPath}
        />
      ))}

      {results != null && results.length === 0 && (
        <NoResults>{"No Results :("}</NoResults>
      )}
    </StyledSidebar>
  );
};

export default Sidebar;

interface QueryResult {
  allMdx: {
    nodes: Array<{
      id: string;
      fields: {
        slug: string;
        section: string;
      };
      frontmatter: {
        title: string;
        order: number;
      };
    }>;
  };
}

const query = graphql`
  query {
    allMdx(sort: { fields: [frontmatter___order], order: ASC }) {
      nodes {
        id
        fields {
          slug
          section
        }
        frontmatter {
          title
          order
        }
      }
    }
  }
`;
