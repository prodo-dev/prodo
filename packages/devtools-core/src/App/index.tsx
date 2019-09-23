import * as React from "react";
import styled, { ThemeProvider } from "styled-components";
import darkTheme from "../styles/theme";
import { DevTools } from "./DevTools";
import UserAppContainer from "./UserAppContainer";

const Layout = styled.div`
  display: flex;
  justify-content: space-between;

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;

    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif,
      "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

interface Props {
  url?: string;
  children?: React.ReactNode;
  skipUserApp?: boolean;
}

export default (props: Props) => (
  <ThemeProvider theme={darkTheme}>
    <Layout className="devToolsApp" data-testid="devToolsApp">
      {!props.skipUserApp && (
        <UserAppContainer url={props.url}>{props.children}</UserAppContainer>
      )}
      <DevTools />
    </Layout>
  </ThemeProvider>
);
