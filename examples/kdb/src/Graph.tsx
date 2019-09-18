import { model, Quote, Trade } from "./model";
import * as React from "react";

interface Axis {
  min: number;
  scale: number;
}

interface Axes {
  x: Axis;
  y: Axis;
}

export const QuoteSpot = ({
  quote: { time, bid, ask },
  axes,
}: {
  quote: Quote;
  axes: Axes;
}) => {
  const x = time.getTime() - axes.x.min;

  return (
    <>
      <circle
        fill="red"
        r="1"
        cx={x * axes.x.scale}
        cy={(bid - axes.y.min) * axes.y.scale}
      />
      <circle
        fill="green"
        r="2"
        cx={x * axes.x.scale}
        cy={(ask - axes.y.min) * axes.y.scale}
      />
    </>
  );
};

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
          stroke="black"
          x1={xs[i - 1] * axes.x.scale}
          x2={xs[i] * axes.x.scale}
          y1={ys[i - 1] * axes.y.scale}
          y2={ys[i - 1] * axes.y.scale}
        />
        <line
          stroke="black"
          strokeDasharray="1 2"
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

export const Graph = model.connect(
  ({ streams, watch }) => ({ idx }: { idx: string }) => {
    const quoteHistory = (watch(streams.quoteHistory) || {})[idx] || [];
    const tradeHistory = (watch(streams.tradeHistory) || {})[idx] || [];

    const yMin = Math.min(...quoteHistory.map(({ bid }) => bid));
    const yMax = Math.max(...quoteHistory.map(({ ask }) => ask));

    const xMin = Math.min(...quoteHistory.map(({ time }) => time.getTime()));
    const axes = {
      x: { min: xMin, scale: 0.05 },
      y: { min: yMin, scale: 100 / (yMax - yMin) },
    };

    return (
      <svg height="100" width="500" viewBox="0 0 500 100">
        <TradeLine trades={tradeHistory} axes={axes} />
        {quoteHistory.map(quote => {
          return (
            <QuoteSpot quote={quote} axes={axes} key={quote.time.getTime()} />
          );
        })}
      </svg>
    );
  },
  "Graph",
);
