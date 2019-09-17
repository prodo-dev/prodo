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
  trades: [Trade, Trade];
  axes: Axes;
}) => {
  const x = trades.map(({ time }) => time.getTime() - axes.x.min);
  const y = trades.map(({ price }) => price - axes.y.min);

  return (
    <>
      <line
        stroke="black"
        x1={x[0] * axes.x.scale}
        x2={x[1] * axes.x.scale}
        y1={y[0] * axes.y.scale}
        y2={y[0] * axes.y.scale}
        key={`trade ${trades[0].sym} ${trades[0].time.getTime()}`}
      />
    </>
  );
};

export const Graph = model.connect(
  ({ streams, watch }) => ({ idx }: { idx: number }) => {
    const quoteHistory = (watch(streams.quoteHistory) || []).map(
      quotes => quotes[idx],
    );
    const tradeHistory = (watch(streams.tradeHistory) || []).map(
      trades => trades[idx],
    );

    const yMin = Math.min(...quoteHistory.map(({ bid }) => bid));
    const yMax = Math.max(...quoteHistory.map(({ ask }) => ask));

    const xMin = Math.min(...quoteHistory.map(({ time }) => time.getTime()));
    const axes = {
      x: { min: xMin, scale: 0.05 },
      y: { min: yMin, scale: 100 / (yMax - yMin) },
    };

    return (
      <svg height="100" width="500" viewBox="0 0 500 100">
        {tradeHistory.map(trades => (
          <TradeLine
            trades={trades}
            axes={axes}
            key={`${trades[0].sym} ${trades[0].time.getTime()}`}
          />
        ))}
        {quoteHistory.map(quote => {
          return (
            <QuoteSpot
              quote={quote}
              axes={axes}
              key={`${quote.sym} ${quote.time.getTime()}`}
            />
          );
        })}
      </svg>
    );
  },
  "Graph",
);
