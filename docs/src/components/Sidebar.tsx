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

const HeadingLink = styled(EmptyLink)<HeadingProps>`
  display: block;
  color: ${props =>
    props.active ? props.theme.colours.secondary : props.theme.colours.text};
`;

const SectionHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
  color: #646464;
  font-size: 0.95em;
  text-transform: uppercase;
  cursor: pointer;
`;

const SectionSubHeading = styled(HeadingLink)`
  padding-bottom: 0.25rem;
  font-size: 1em;
  font-weight: bold;
`;

const StyledSection = styled.div`
  padding-bottom: 0.5rem;
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
    <StyledSection>
      <SectionHeading onClick={() => setExpanded(!expanded)}>
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
  padding: 1rem;
  padding-top: 1rem;
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

  const [isSearching, setIsSearching] = React.useState(false);
  const [filter, setFilter] = React.useState<string[] | null>(null);

  const currentPath = props.location.pathname;
  const sections = getSections(data, filter);

  return (
    <StyledSidebar className="sidebar" isOpen={props.isOpen}>
      <Search
        onSearchResults={results => {
          setFilter(results);
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

      {filter != null && filter.length === 0 && <p>{"No Results :("}</p>}
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
  query SidebarQuery {
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
