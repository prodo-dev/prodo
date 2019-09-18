import * as React from "react";
import {
  model,
  Streams,
  KxEvent,
  KxQuote,
  KxTrade,
  Quote,
  Trade,
} from "./model";
import { webSocket } from "rxjs/webSocket";
import { UnStreams } from "@prodo/stream-plugin";
import { Graph } from "./Graph";
import * as op from "rxjs/operators";

type Msg =
  | {
      func: "getQuotes";
      result: KxQuote[];
    }
  | {
      func: "getTrades";
      result: KxTrade[];
    }
  | {
      func: "getSyms";
      result: string[];
    };

const filterQuotes = (
  msg: Msg | string,
): msg is {
  func: "getQuotes";
  result: KxQuote[];
} => typeof msg !== "string" && msg.func === "getQuotes";

const filterTrades = (
  msg: Msg | string,
): msg is {
  func: "getTrades";
  result: KxTrade[];
} => typeof msg !== "string" && msg.func === "getTrades";

const parseKxTime = (date: string): Date => {
  const out = new Date();
  const [hour, min, sec] = date
    .slice(2)
    .split(":")
    .map(parseFloat);
  out.setHours(hour, min, sec);
  return out;
};

function parseEvents<I extends KxEvent>(
  event: I[],
): { [key: string]: Omit<I, "time"> & { time: Date } } {
  return Object.fromEntries(
    event.map(
      (e): [string, Omit<I, "time"> & { time: Date }] => [
        e.sym,
        { ...e, time: parseKxTime(e.time) },
      ],
    ),
  );
}

const kdbSocket = (url: string = "ws://localhost:5001") => {
  const ws = webSocket<Msg | string>({
    url,
    serializer: msg => (typeof msg === "string" ? msg : JSON.stringify(msg)),
  });
  ws.next("loadPage[]");

  const quotes = ws.pipe(
    op.filter(filterQuotes),
    op.map(({ result }): {[key: string]: Quote} => parseEvents(result)),
  );
  const trades = ws.pipe(
    op.filter(filterTrades),
    op.map(({ result }): {[key: string]: Trade} => parseEvents(result)),
  );

  return { quotes, trades };
};

export const setupStreams = model.action(
  ({ streams }) => (historySize: number) => {
    const { quotes, trades } = kdbSocket();
    streams.quotes = quotes;
    streams.trades = trades;

    streams.quoteHistory = quotes.pipe(
      op.scan(
        (acc, quotes) =>
          Object.fromEntries(
            Object.entries(quotes).map(([sym, value]): [string, Quote[]] => [
              sym,
              [...(acc[sym] || []).slice(-historySize), value],
            ]),
          ),
        {} as {[key: string]: Quote[]},
      ),
    );

    streams.tradeHistory = trades.pipe(
      op.scan(
        (acc, trades) =>
          Object.fromEntries(
            Object.entries(trades).map(([sym, value]): [string, Trade[]] => [
              sym,
              [...(acc[sym] || []).slice(-historySize), value],
            ]),
          ),
        {} as {[key: string]: Trade[]},
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
      const values: UnStreams<Streams>[K] = watch(streams[data]) as any || {};

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
