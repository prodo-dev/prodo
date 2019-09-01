import * as React from "react";
import { model } from "./model";

const Square = model.connect(({ random }) => ({ id }: { id: string }) => (
  <div className="square" style={{ backgroundColor: random(id) }}>
    <h3>{id}</h3>
  </div>
));

const numSquares = 40;
const possibleIds = ["1", "2", "3", "4", "5"];

export default () => {
  const arr = new Array(numSquares).fill(0);

  return (
    <div className="random">
      {arr.map((_, i) => (
        <Square
          key={i}
          id={possibleIds[Math.floor(Math.random() * possibleIds.length)]}
        />
      ))}
    </div>
  );
};
