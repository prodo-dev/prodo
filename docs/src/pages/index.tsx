import * as React from "react";
import styled from "styled-components";
import { ButtonLink } from "../components/Button";
import Container from "../components/Container";
import Header from "../components/Header";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import { HeaderHeight } from "../styles";

const Hero = styled.div`
  display: flex;
  align-items: center;
  min-height: calc(100vh - ${HeaderHeight}px);
  background-color: #282c34;
  color: white;
`;

const Title = styled.h1`
  font-size: 4rem;
`;

const SubTitle = styled.h3``;

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
          <div>
            <ButtonLink primary to="/introduction/getting-started">
              Get Started
            </ButtonLink>
          </div>
        </Container>
      </Hero>
    </Layout>
  );
};

export default Home;
