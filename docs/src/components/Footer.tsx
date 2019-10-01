import * as React from "react";
import styled from "styled-components";
import { FooterHeight } from "../styles";
import Container from "./Container";
import Link from "./Link";

const StyledFooter = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: ${FooterHeight}px;
  padding: 2rem 0;
  background-color: #20232a;
  color: lightgrey;
  font-size: 0.9em;
`;

const NavLink = styled(Link)`
  padding: 0 0.5rem;
  color: white;
  text-decoration: underline;

  &:hover {
    text-decoration: underline;
  }
`;

const StyledNav = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding-bottom: 1rem;
`;

const Nav = () => (
  <StyledNav>
    <NavLink to="/introduction">Introduction</NavLink>
    <NavLink to="/basics">Basics</NavLink>
    <NavLink to="/plugins">Plugins</NavLink>
    <NavLink to="/advanced">Advanced</NavLink>
    <NavLink to="/tutorials">Tutorials</NavLink>
    <NavLink to="/api-reference">API Reference</NavLink>
  </StyledNav>
);

const Footer = () => (
  <StyledFooter>
    <Container>
      <Nav />© 2019 Prodo Tech Ltd
    </Container>
  </StyledFooter>
);

export default Footer;
