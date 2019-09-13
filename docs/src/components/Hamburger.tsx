import * as React from "react";
import styled from "styled-components";

const width = "25px";
const height = "3px";

const Bar = styled.div`
  width: ${width};
  height: ${height};
  background-color: #ababab;
  margin: 4px 0;
`;

const Hamburger = () => (
  <div>
    <Bar />
    <Bar />
    <Bar />
  </div>
);

export default Hamburger;
