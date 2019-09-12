import * as React from "react";
import styled from "styled-components";
import { DevTools } from "./DevTools";
import UserAppContainer from "./UserAppContainer";

const Layout = styled.div`
  display: flex;
  justify-content: space-between;

  padding: 1rem;
`;

interface Props {
  url?: string;
  children?: React.ReactNode;
}

export const DevToolsApp = (props: Props) => (
  <Layout>
    <UserAppContainer url={props.url}>{props.children}</UserAppContainer>
    <DevTools />
  </Layout>
);

export default DevToolsApp;
