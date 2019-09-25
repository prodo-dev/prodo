import * as React from "react";
import styled from "styled-components";
import { ButtonLink } from "../components/Button";
import Container from "../components/Container";
import Code from "../components/Code";
import Header from "../components/Header";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import { HeaderHeight } from "../styles";

const Hero = styled.div`
  display: flex;
  align-items: center;
  min-height: calc(100vh - ${HeaderHeight}px);
`;

const Title = styled.h1`
  margin-bottom: 0;
  font-size: 4rem;
  border-bottom: 0;
`;

const SubTitle = styled.h3`
  margin-top: 0;
`;

const code = `
# init
yarn create prodo-app my-app

# install
cd my-app
yarn

# start
yarn start
`.trim();

const Home = () => {
  return (
    <Layout>
      <SEO />
      <Header />
      <Hero>
        <Container>
          <Title>Prodo</Title>
          <SubTitle>
            The full-stack web framework to build apps faster.
          </SubTitle>
          <ButtonLink primary to="/introduction/getting-started">
            Get Started
          </ButtonLink>

          <Code language="shell" codeString={code} />
        </Container>
      </Hero>
    </Layout>
  );
};

export default Home;
