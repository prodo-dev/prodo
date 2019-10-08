import { Location } from "@reach/router";
import * as React from "react";
import styled from "styled-components";
import { ExperimentalBanner, WipBanner } from "../components/Banner";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Hamburger from "../components/Hamburger";
import Header from "../components/Header";
import Layout from "../components/Layout";
import Link from "../components/Link";
import Sidebar from "../components/Sidebar";
import {
  FooterHeight,
  forNarrowScreen,
  forWideScreen,
  HeaderHeight,
  SidebarWidth,
} from "../styles";
import { makeAnchor } from "../utils";
import { Title } from "./Text";

export interface Props {
  title?: string;
  toc?: boolean;
  experimental?: boolean;
  wip?: boolean;
  headings?: Array<{ value: string; depth: number }>;
}

interface Heading {
  value: string;
  depth: number;
  subheadings: Heading[];
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
  padding-top: 0rem;
  padding-bottom: 2rem;

  ${forWideScreen`padding-top: 1.5rem`};
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

const getGroupedHeadings = (
  headings: Array<{ value: string; depth: number }>,
): Heading[] => {
  const groupedHeadings: Heading[] = [];

  let currentHeading: Heading | null = null;
  for (const { value, depth } of headings) {
    if (currentHeading == null) {
      currentHeading = { value, depth, subheadings: [] };
    } else {
      // heading is a subheading of currentHeading
      // all levels of subheading are treated as subheadings of currentHeading
      if (depth > currentHeading.depth) {
        currentHeading.subheadings.push({ value, depth, subheadings: [] });
      } else {
        groupedHeadings.push(currentHeading);
        currentHeading = { value, depth, subheadings: [] };
      }
    }
  }

  if (currentHeading != null) {
    groupedHeadings.push(currentHeading);
  }

  return groupedHeadings;
};

const StyledTOC = styled.div`
  padding: 1rem 0;
`;

const TOCList: React.FC<{
  currentPath: string;
  headings: Heading[];
}> = props => (
  <ul>
    {props.headings.map(heading => (
      <li key={heading.value}>
        <Link to={`${props.currentPath}#${makeAnchor(heading.value)}`}>
          {heading.value}
        </Link>

        {heading.subheadings.length !== 0 && (
          <TOCList
            currentPath={props.currentPath}
            headings={heading.subheadings}
          />
        )}
      </li>
    ))}
  </ul>
);

const TableOfContents: React.FC<{
  currentPath: string;
  headings: Array<{ value: string; depth: number }>;
}> = props => {
  const groupedHeadings = getGroupedHeadings(
    props.headings.filter(h => h.depth <= 2),
  );

  return (
    <StyledTOC>
      <TOCList currentPath={props.currentPath} headings={groupedHeadings} />
    </StyledTOC>
  );
};

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
                <DocsContainer>
                  {props.title != null && <Title>{props.title}</Title>}

                  {props.toc &&
                    props.headings &&
                    props.headings.length !== 0 && (
                      <TableOfContents
                        currentPath={location.pathname}
                        headings={props.headings}
                      />
                    )}

                  {props.children}
                </DocsContainer>
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
