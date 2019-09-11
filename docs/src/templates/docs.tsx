import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import * as React from "react";
import DocsLayout from "../components/DocsLayout";
import SEO from "../components/SEO";
import { Title } from "../components/Text";

export interface Props {
  data: {
    mdx: {
      frontmatter: {
        title: string;
      };
      body: string;
    };
  };
}

const Docs = ({ data }: Props) => {
  return (
    <DocsLayout>
      <SEO title={data.mdx.frontmatter.title} />
      <Title>{data.mdx.frontmatter.title}</Title>
      <MDXRenderer>{data.mdx.body}</MDXRenderer>
    </DocsLayout>
  );
};

export default Docs;

export const pageQuery = graphql`
  query($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
      }
      body
    }
  }
`;
