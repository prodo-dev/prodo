import { model } from "./model";
import * as React from "react";

export const Graph = model.connect(
  ({ }) => () => {
    const [history] = React.useState([]);
    if (history.length === 0) {
      return (
        <svg height="500" width="500" viewBox="-50 -50 100 100">
          <circle r="10" />
        </svg>
      );
    }

    return (
      <svg height="500" width="500" viewBox="0 0 100 100">
        <circle r="10" />
      </svg>
    );
  },
  "Graph",
);
