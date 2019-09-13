import { Location } from "@reach/router";
import * as React from "react";
import styled from "styled-components";
import Container from "../components/Container";
import Hamburger from "../components/Hamburger";
import Header from "../components/Header";
import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
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

  .gatsby-highlight + h1 {
    margin-top: 3rem;
  }

  .gatsby-highlight + h2 {
    margin-top: 3rem;
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

const DocsLayout: React.FC = props => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <Layout>
      <Location>
        {({ location }) => (
          <>
            <Header />

            <Sidebar isOpen={isSidebarOpen} location={location} />
            <SidebarButton onClick={() => setSidebarOpen(true)} />

            <ContentWrapper>
              <Container>{props.children}</Container>
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

export default DocsLayout;
