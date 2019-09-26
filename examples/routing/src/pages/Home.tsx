import * as React from "react";
import { Link } from "@prodo/route";

const Home = () => (
  <div>
    <h1 className="title">Home</h1>
    <p>
      This is a test for the <a href="https://docs.prodo.dev">route plugin</a>.
    </p>

    <ul>
      <li>
        <Link
          to={{
            path: "izzy",
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
            path: "/bill-gates/",
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
            path: "/wayne-gretzky",
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
            path: "/ellon-musk",
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
