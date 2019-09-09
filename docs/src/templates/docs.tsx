import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import * as React from "react";
import styled from "styled-components";
import Container from "../components/Container";
import Header from "../components/Header";
import Layout from "../components/Layout";
import SEO from "../components/SEO";

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

const DocsContainer = styled(Container)`
  padding-top: 1rem;
`;

const Docs = ({ data }: Props) => {
  return (
    <Layout>
      <SEO title={data.mdx.frontmatter.title} />
      <Header />
      <DocsContainer>
        <MDXRenderer>{data.mdx.body}</MDXRenderer>
      </DocsContainer>
    </Layout>
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
