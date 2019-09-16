import * as React from "react";
import styled from "styled-components";
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
  <Layout>
    {!props.skipUserApp && (
      <UserAppContainer url={props.url}>{props.children}</UserAppContainer>
    )}
    <DevTools />
  </Layout>
);
