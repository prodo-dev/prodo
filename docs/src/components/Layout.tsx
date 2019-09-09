import { MDXProvider } from "@mdx-js/react";
import * as React from "react";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { ExternalLink } from "../components/Link";
import { H1, H2, H3 } from "../components/Text";
import { theme } from "../styles";

const GlobalStyle = createGlobalStyle`
  body {
    background: ${props => props.theme.colours.bg}
    scroll-behavior: smooth;
  }
`;

const ContentWrapper = styled.div`
  margin: 0;
  padding: 0;
  margin: 0 auto;
`;

const components = {
  p: Text,
  h1: H1,
  h2: H2,
  h3: H3,
  a: ExternalLink,
};

const Layout: React.FC = ({ children }) => {
  return (
    <MDXProvider components={components}>
      <ThemeProvider theme={theme}>
        <>
          <GlobalStyle />
          <ContentWrapper>{children}</ContentWrapper>
        </>
      </ThemeProvider>
    </MDXProvider>
  );
};

export default Layout;
