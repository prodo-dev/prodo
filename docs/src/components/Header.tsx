import * as React from "react";
import styled from "styled-components";
import logo from "../logo.svg";
import Container from "./Container";
import Link from "./Link";

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
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
      <Link to="/" empty>
        <LogoText>
          <Logo src={logo} />
          <h2>Prodo</h2>
        </LogoText>
      </Link>
    </Container>
  </StyledHeader>
);

export default Header;
