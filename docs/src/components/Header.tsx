import * as React from "react";
import styled from "styled-components";
import logo from "../logo.svg";
import Container from "./Container";
import { EmptyLink } from "./Link";
import { HeaderHeight } from "../styles";

const StyledHeader = styled.header`
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  height: ${HeaderHeight}px;
  padding: 0.5rem 0;
  background-color: #20232a;
  color: white;
`;

const LogoText = styled.div`
  display: flex;
  align-items: center;

  h2 {
    margin-bottom: 0;
    padding-left: 0.5rem;
  }
`;

const Logo = styled.img`
  max-width: 3rem;
  margin-bottom: 0;
`;

const Header = () => (
  <StyledHeader>
    <Container>
      <div>
        <EmptyLink to="/">
          <LogoText>
            <Logo src={logo} />
            <h2>Prodo</h2>
          </LogoText>
        </EmptyLink>
      </div>
    </Container>
  </StyledHeader>
);

export default Header;
