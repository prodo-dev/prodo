import { Quote, Trade } from "./model";
import * as React from "react";

interface Axis {
  min: number;
  scale: number;
}

interface Axes {
  x: Axis;
  y: Axis;
}

export const QuoteSpots = ({
  quotes,
  axes,
}: {
  quotes: Quote[];
  axes: Axes;
}) => (
  <>
    {quotes.map(({ time, ask, bid }) => {
      const x = time.getTime() - axes.x.min;

      return (
        <>
          <circle
            className="bid"
            r={3}
            cx={x * axes.x.scale}
            cy={(bid - axes.y.min) * axes.y.scale}
          />
          <circle
            className="ask"
            r={3}
            cx={x * axes.x.scale}
            cy={(ask - axes.y.min) * axes.y.scale}
          />
        </>
      );
    })}
  </>
);

export const TradeLine = ({
  trades,
  axes,
}: {
  trades: Trade[];
  axes: Axes;
}) => {
  const xs = trades.map(({ time }) => time.getTime() - axes.x.min);
  const ys = trades.map(({ price }) => price - axes.y.min);

  const lines: JSX.Element[] = [];
  for (let i = 2; i < trades.length; i++) {
    lines.push(
      <g key={trades[i].time.getTime()}>
        <line
          x1={xs[i - 1] * axes.x.scale}
          x2={xs[i] * axes.x.scale}
          y1={ys[i - 1] * axes.y.scale}
          y2={ys[i - 1] * axes.y.scale}
        />
        <line
          className="vertical"
          x1={xs[i] * axes.x.scale}
          x2={xs[i] * axes.x.scale}
          y1={ys[i - 1] * axes.y.scale}
          y2={ys[i] * axes.y.scale}
        />
      </g>,
    );
  }

  return <>{lines}</>;
};
