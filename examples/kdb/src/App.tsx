import * as React from "react";
import { model, Streams, Quote, Trade } from "./model";
import { QuoteSpots, TradeLine } from "./Graph";
import { kdbSocket } from "./libKx";
import { UnStreams } from "@prodo/stream-plugin";
import * as op from "rxjs/operators";

export const setupStreams = model.action(
  ({ streams }) => (historySize: number) => {
    const { quotes, trades } = kdbSocket();
    streams.quotes = quotes;
    streams.trades = trades;

    streams.quoteHistory = quotes.pipe(
      op.scan(
        (acc, quotes) =>
          Object.fromEntries(
            Object.entries(quotes).map(
              ([sym, value]): [string, Quote[]] => [
                sym,
                [...(acc[sym] || []).slice(-historySize), value],
              ],
            ),
          ),
        {} as { [key: string]: Quote[] },
      ),
    );

    streams.tradeHistory = trades.pipe(
      op.scan(
        (acc, trades) =>
          Object.fromEntries(
            Object.entries(trades).map(
              ([sym, value]): [string, Trade[]] => [
                sym,
                [...(acc[sym] || []).slice(-historySize), value],
              ],
            ),
          ),
        {} as { [key: string]: Trade[] },
      ),
    );
  },
);

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const Table = <
  K extends "quotes" | "trades",
  J extends keyof UnStreams<Streams>[K][0] & string
>(
  data: K,
  props: J[],
) =>
  model.connect(
    ({ streams, watch }) => () => {
      const values: UnStreams<Streams>[K] = (watch(streams[data]) as any) || {};

      return (
        <table>
          <caption>{capitalize(data)}</caption>
          <tbody>
            <tr>
              {props.map(prop => (
                <th key={prop}>{capitalize(prop)}</th>
              ))}
            </tr>
            {Object.values(values).map(value => (
              <tr key={value.sym}>
                {props.map(prop => (
                  <td key={prop}>{value[prop]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    },
    capitalize(data),
  );

const Trades = Table("trades", ["sym", "price", "size"]);
const Quotes = Table("quotes", ["sym", "bid", "ask"]);

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
      <svg height="100" width="500" viewBox="0 -5 500 110">
        <TradeLine trades={tradeHistory} axes={axes} />
        <QuoteSpots quotes={quoteHistory} axes={axes} />
      </svg>
    );
  },
  "Graph",
);

export default model.connect(
  ({ dispatch }) => () => {
    React.useEffect(() => {
      dispatch(setupStreams)(10);
    }, []);

    return (
      <>
        <Trades />
        <Quotes />
        <Graph idx={"BA.N"} />
        <Graph idx={"GS.N"} />
        <Graph idx={"IBM.N"} />
        <Graph idx={"MSFT.O"} />
        <Graph idx={"VOD.L"} />
      </>
    );
  },
  "App",
);
