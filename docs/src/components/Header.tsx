import * as React from "react";
import styled from "styled-components";
import logo from "../logo.svg";
import { HeaderHeight } from "../styles";
import Container from "./Container";
import Link, { EmptyLink } from "./Link";

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

const HeaderContainer = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderLinks = styled.div`
  a {
    color: white;
  }
`;

const Header = () => (
  <StyledHeader>
    <HeaderContainer>
      <EmptyLink to="/">
        <LogoText>
          <Logo src={logo} />
          <h2>Prodo</h2>
        </LogoText>
      </EmptyLink>
      <HeaderLinks>
        <Link to="https://github.com/prodo-ai/prodo" target="_blank">
          Github
        </Link>
      </HeaderLinks>
    </HeaderContainer>
  </StyledHeader>
);

export default Header;
