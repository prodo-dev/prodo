import { graphql } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import DocsLayout from "../components/DocsLayout";
import Link from "../components/Link";
import { Title } from "../components/Text";
import { normalize } from "../utils";

export interface Props {
  pageContext: {
    section: string;
    normalizedName: string;
  };
  data: {
    allMdx: {
      nodes: Array<{
        frontmatter: {
          title: string;
          order: number;
        };
        fields: {
          slug: string;
          section: string;
        };
      }>;
    };
  };
}

const SubSectionLink = styled(Link)`
  display: block;
  font-size: 1.4em;
  padding-bottom: 0.5rem;
`;

const DocsSection = (props: Props) => {
  const subSections = props.data.allMdx.nodes.sort(
    (a, b) => a.frontmatter.order - b.frontmatter.order,
  );

  return (
    <DocsLayout>
      <Title>{normalize(props.pageContext.normalizedName)}</Title>
      {subSections.map(subSection => (
        <SubSectionLink
          key={subSection.fields.slug}
          to={subSection.fields.slug}
        >
          {subSection.frontmatter.title}
        </SubSectionLink>
      ))}
    </DocsLayout>
  );
};

export default DocsSection;

export const pageQuery = graphql`
  query($section: String!) {
    allMdx(filter: { fields: { section: { eq: $section } } }) {
      nodes {
        frontmatter {
          title
          order
        }
        fields {
          slug
          section
        }
      }
    }
  }
`;
