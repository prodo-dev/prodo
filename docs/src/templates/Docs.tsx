import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import * as React from "react";
import DocsLayout from "../components/DocsLayout";
import SEO from "../components/SEO";

export interface Props {
  data: {
    mdx: {
      frontmatter: {
        title: string;
        experimental?: boolean;
        wip?: boolean;
        toc?: boolean;
      };
      headings: Array<{ value: string; depth: number }>;
      body: string;
      excerpt: string;
    };
  };
}

const Docs = ({ data }: Props) => {
  return (
    <DocsLayout
      experimental={data.mdx.frontmatter.experimental}
      wip={data.mdx.frontmatter.wip}
      toc={data.mdx.frontmatter.toc}
      headings={data.mdx.headings}
      title={data.mdx.frontmatter.title}
    >
      <SEO title={data.mdx.frontmatter.title} description={data.mdx.excerpt} />
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
        experimental
        wip
        toc
      }
      headings {
        value
        depth
      }
      body
      excerpt
    }
  }
`;
