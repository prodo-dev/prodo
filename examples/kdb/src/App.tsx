import * as React from "react";
import { model, Quote, Trade } from "./model";
import * as rx from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import * as op from "rxjs/operators";

type Msg =
  | {
      func: "getQuotes";
      result: Quote[];
    }
  | {
      func: "getTrades";
      result: Trade[];
    }
  | {
      func: "getSyms";
      result: string[];
    };

const kdbSocket = (url: string = "ws://localhost:5001") => {
  const ws = new WebSocketSubject<Msg>({ url, serializer: msg => msg });
  ws.next("loadPage[]");

  const quotes = ws.pipe(
    op.filter(msg => msg.func == "getQuotes"),
    op.map(({ result }) => result),
  );
  const trades = ws.pipe(
    op.filter(msg => msg.func == "getTrades"),
    op.map(({ result }) => result),
  );
  trades.subscribe(console.log);

  return { quotes, trades };
};

export const setupStreams = model.action(({ streams }) => () => {
  const { quotes, trades } = kdbSocket();
  streams.quotes = quotes;
  streams.trades = trades;
});

const Trades = model.connect(
  ({ streams, watch }) => () => {
    return (
      <table>
        <caption>Trades</caption>
        <tbody>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>Size</th>
          </tr>
          {(watch(streams.trades) || []).map(({ sym, price, size }) => (
            <tr key={sym}>
              <td>{sym}</td>
              <td>{price}</td>
              <td>{size}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
  "Trades",
);

const Quotes = model.connect(
  ({ streams, watch }) => () => {
    return (
      <table>
        <caption>Quotes</caption>
        <tbody>
          <tr>
            <th>Symbol</th>
            <th>Bid</th>
            <th>Ask</th>
          </tr>
          {(watch(streams.quotes) || []).map(({ sym, bid, ask}) => (
            <tr key={sym}>
              <td>{sym}</td>
              <td>{bid}</td>
              <td>{ask}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
  "Trades",
);

export default model.connect(
  ({ streams, dispatch }) => () => {
    React.useEffect(() => {
      dispatch(setupStreams)();
    }, []);

    return (
      <>
        <Trades />
        <Quotes />
      </>
    );
  },
  "App",
);
