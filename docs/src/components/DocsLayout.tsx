import { Location } from "@reach/router";
import * as React from "react";
import styled from "styled-components";
import { ExperimentalBanner, WipBanner } from "../components/Banner";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Hamburger from "../components/Hamburger";
import Header from "../components/Header";
import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import {
  FooterHeight,
  forNarrowScreen,
  forWideScreen,
  HeaderHeight,
  SidebarWidth,
} from "../styles";

export interface Props {
  experimental?: boolean;
  wip?: boolean;
}

const FullPage = styled.div`
  min-height: calc(100vh - ${HeaderHeight}px - ${FooterHeight}px);
`;

const ContentWrapper = styled.div`
  position: relative;
  transition: margin-left: 250ms ease-out;

  ${forWideScreen`width: calc(100vw - ${SidebarWidth + 16}px);`};
  ${forWideScreen`margin-left: ${SidebarWidth}px;`};
`;

const DocsContainer = styled(Container)`
  padding-top: 1rem;
  padding-bottom: 2rem;

  ${forWideScreen`padding-top: 4rem`};

  .gatsby-highlight {
    margin-bottom: 1.5rem;
  }

  .gatsby-highlight + h1 {
    margin-top: 3rem;
  }

  .gatsby-highlight + h2 {
    margin-top: 3rem;
  }
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

const DocsLayout: React.FC<Props> = props => {
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
              <FullPage>
                {props.experimental && <ExperimentalBanner />}
                {props.wip && <WipBanner />}
                <DocsContainer>{props.children}</DocsContainer>
              </FullPage>

              <Footer />
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
