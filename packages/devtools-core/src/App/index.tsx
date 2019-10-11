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
  children?: React.ReactNode;
  skipUserApp?: boolean;
}

export default (props: Props) => (
  <ThemeProvider theme={darkTheme}>
    <Layout className="devToolsApp" data-testid="devToolsApp">
      {!props.skipUserApp && (
        <UserAppContainer>{props.children}</UserAppContainer>
      )}
      <DevTools />
    </Layout>
  </ThemeProvider>
);
