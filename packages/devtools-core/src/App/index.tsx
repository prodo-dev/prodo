import * as React from "react";
import styled, { ThemeProvider } from "styled-components";
import darkTheme from "../styles/theme";
import { DevTools } from "./DevTools";
import UserAppContainer from "./UserAppContainer";

const Layout = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface Props {
  url?: string;
  children?: React.ReactNode;
  skipUserApp?: boolean;
}

export default (props: Props) => (
  <Layout className="devToolsApp" data-testid="devToolsApp">
    {!props.skipUserApp && (
      <UserAppContainer url={props.url}>{props.children}</UserAppContainer>
    )}
    <ThemeProvider theme={darkTheme}>
      <DevTools />
    </ThemeProvider>
  </Layout>
);
