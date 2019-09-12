import * as React from "react";
import styled from "styled-components";
import Panels from "./DevTools";
import UserAppContainer from "./UserAppContainer";

const Layout = styled.div`
  display: flex;
  justify-content: space-between;
`;

const App = () => (
  <>
    <h1>Developer Tools</h1>
    <Layout>
      <UserAppContainer />
      <Panels />
    </Layout>
  </>
);

export default App;
