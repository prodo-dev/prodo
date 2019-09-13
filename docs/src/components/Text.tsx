import * as React from "react";
import styled from "styled-components";
import { makeAnchor } from "../utils";

export const H1: React.FC = props => (
  <h1 id={makeAnchor(props.children)} {...props} />
);
export const H2: React.FC = props => (
  <h2 id={makeAnchor(props.children)} {...props} />
);
export const H3: React.FC = props => <h3 {...props} />;

export const Title = styled.h1`
  font-size: 3em;
`;
