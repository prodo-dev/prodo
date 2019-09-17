import * as React from "react";
import { model, Streams, KxQuote, KxTrade, Quote, Trade } from "./model";
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

const kdbSocket = (url: string = "ws://localhost:5001") => {
  const ws = webSocket<Msg | string>({
    url,
    serializer: msg => (typeof msg === "string" ? msg : JSON.stringify(msg)),
  });
  ws.next("loadPage[]");

  const quotes = ws.pipe(
    op.filter(filterQuotes),
    op.map(({ result }) => 
      result.map(quote => ({ ...quote, time: parseKxTime(quote.time) }))
    ),
  );
  const trades = ws.pipe(
    op.filter(filterTrades),
    op.map(({ result }) =>
      result.map(trade => ({ ...trade, time: parseKxTime(trade.time) })),
    ),
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
        (acc, quotes) => {
          return [...acc.slice(-(historySize - quotes.length)), quotes];
        },
        [] as Quote[][],
      ),
    );

    streams.tradeHistory = trades.pipe(
      op.pairwise(),
      op.map(tradess =>
        tradess[0].map((trade, i) => [trade, tradess[1][i]] as [Trade, Trade]),
      ),
      op.scan(
        (acc, trades) => {
          return [...acc.slice(-historySize), trades];
        },
        [] as [Trade, Trade][][],
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
      return (
        <table>
          <caption>{capitalize(data)}</caption>
          <tbody>
            <tr>
              {props.map(prop => (
                <th key={prop}>{capitalize(prop)}</th>
              ))}
            </tr>
            {((watch(streams[data]) as any[]) || []).map(value => (
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
        <Graph idx={0} />
        <Graph idx={1} />
        <Graph idx={2} />
        <Graph idx={3} />
        <Graph idx={4} />
      </>
    );
  },
  "App",
);
