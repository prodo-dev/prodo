import { Link } from "@prodo/route";
import * as React from "react";
import styled from "styled-components";

const StyledTitle = styled.h1`
  color: pink;
`;

const Home = () => (
  <div>
    <StyledTitle className="title">Home</StyledTitle>
    <p>
      This is a test for the <a href="https://docs.prodo.dev">route plugin</a>.
    </p>

    <ul>
      <li>
        <Link
          to={{
            path: "users/izzy",
            params: {
              species: "dog",
            },
          }}
        >
          Izzy
        </Link>
      </li>
      <li>
        <Link
          to={{
            path: "/users/bill-gates/",
            params: {
              species: "human",
              company: "microsoft",
            },
          }}
        >
          Bill Gates
        </Link>
      </li>
      <li>
        <Link
          to={{
            path: "users/wayne-gretzky",
            params: {
              species: "human",
              sport: "hockey",
              number: "99",
            },
          }}
        >
          Wayne Gretzky
        </Link>
      </li>
      <li>
        <Link
          to={{
            path: "/users/elon-musk",
            params: {
              species: "human",
              ["net worth"]: "20 billion",
            },
          }}
        >
          Elon Musk
        </Link>
      </li>
      <li>
        <Link to="/not-found">Not found</Link>
      </li>
    </ul>
  </div>
);

export default Home;
