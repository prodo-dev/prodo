import * as React from "react";
import styled from "styled-components";
import Button, { ButtonLink } from "../components/Button";
import Container from "../components/Container";
import Header from "../components/Header";
import Layout from "../components/Layout";
import SEO from "../components/SEO";

const Hero = styled.div`
  padding: 8rem 0;
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
            <ButtonLink to="/getting_started">Get Started</ButtonLink>
          </div>
        </Container>
      </Hero>
    </Layout>
  );
};

export default Home;
