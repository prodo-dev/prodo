import * as React from "react";
import styled from "styled-components";
import Container from "./Container";
import { forWideScreen } from "../styles";

const Banner = styled.div<{ background: string }>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 3rem;
  margin-top: 1rem;
  background: ${props => props.background};
  font-weight: bold;

  ${forWideScreen`position: absolute;`};
  ${forWideScreen`margin-top: 0;`};
`;

export const ExperimentalBanner = () => (
  <Banner background="gold">
    <Container>This feature is experimental</Container>
  </Banner>
);

const wipDark = "white";
const wipLight = "#ffdf30";

export const WipBanner = () => (
  <Banner
    background={`repeating-linear-gradient(
    -45deg,
    ${wipDark},
    ${wipDark} 10px,
    ${wipLight} 10px,
    ${wipLight} 20px
  );`}
  >
    <Container>
      This feature is a work in progress and not yet available
    </Container>
  </Banner>
);
