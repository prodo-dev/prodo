import { Location } from "@reach/router";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import * as React from "react";
import styled from "styled-components";
import Container from "../components/Container";
import Hamburger from "../components/Hamburger";
import Header from "../components/Header";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import Sidebar from "../components/Sidebar";
import { Title } from "../components/Text";
import { forNarrowScreen, forWideScreen, SidebarWidth } from "../styles";

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

const ContentWrapper = styled.div`
  padding-top: 2rem;
  transition: margin-left: 250ms ease-out;

  .gatsby-highlight {
    margin-bottom: 1.5rem;
  }

  ${forWideScreen`width: calc(100vw - ${SidebarWidth + 16}px);`};
  ${forWideScreen`margin-left: ${SidebarWidth}px;`};
  ${forWideScreen`padding-top: 4rem`};
`;

const Overlay = styled.div<{ isOpen: boolean }>`
  background-color: black;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  opacity: 0;
  transition: opacity 250ms ease-in-out;

  ${forWideScreen`display: none;`}
  ${props => !props.isOpen && forNarrowScreen`transform: translateX(-100%);`};
  ${props => props.isOpen && forNarrowScreen`opacity: 0.6;`};
`;

const StyledSidebarButton = styled.div`
  display: block;
  padding-top: 1rem;
  padding-left: 1rem;
  cursor: pointer;
  z-index: 1000;

  ${forWideScreen`display: none;`};
`;

const SidebarButton: React.FC<{ onClick: () => void }> = props => (
  <StyledSidebarButton onClick={() => props.onClick()}>
    <Hamburger />
  </StyledSidebarButton>
);

const Docs = ({ data }: Props) => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <Layout>
      <SEO title={data.mdx.frontmatter.title} />
      <Location>
        {({ location }) => (
          <>
            <Header />

            <Sidebar isOpen={isSidebarOpen} location={location} />

            <SidebarButton onClick={() => setSidebarOpen(true)} />

            <ContentWrapper>
              <Container>
                <Title>{data.mdx.frontmatter.title}</Title>
                <MDXRenderer>{data.mdx.body}</MDXRenderer>
              </Container>
            </ContentWrapper>

            <Overlay
              className="overlay"
              isOpen={isSidebarOpen}
              onClick={() => setSidebarOpen(false)}
            />
          </>
        )}
      </Location>
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
