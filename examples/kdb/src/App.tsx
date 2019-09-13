import * as React from "react";
import { model, Streams, Quote, Trade } from "./model";
import { webSocket } from "rxjs/webSocket";
import { UnStreams } from "@prodo/stream-plugin";
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

const filterQuotes = (
  msg: Msg | string,
): msg is {
  func: "getQuotes";
  result: Quote[];
} => typeof msg !== "string" && msg.func === "getQuotes";

const filterTrades = (
  msg: Msg | string,
): msg is {
  func: "getTrades";
  result: Trade[];
} => typeof msg !== "string" && msg.func === "getTrades";

const kdbSocket = (url: string = "ws://localhost:5001") => {
  const ws = webSocket<Msg | string>({
    url,
    serializer: msg => (typeof msg === "string" ? msg : JSON.stringify(msg)),
  });
  ws.next("loadPage[]");

  const quotes = ws.pipe(
    op.filter(filterQuotes),
    op.map(({ result }) => result),
  );
  const trades = ws.pipe(
    op.filter(filterTrades),
    op.map(({ result }) => result),
  );

  return { quotes, trades };
};

export const setupStreams = model.action(({ streams }) => () => {
  const { quotes, trades } = kdbSocket();
  streams.quotes = quotes;
  streams.trades = trades;
});

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const Table = <
  K extends keyof Streams,
  J extends keyof UnStreams<Streams>[K][0]
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
              {(props as any[]).map(prop => (
                <th>{capitalize(prop)}</th>
              ))}
            </tr>
            {((watch(streams[data]) as any[]) || []).map(value => (
              <tr key={value.sym}>
                {props.map(prop => (
                  <td>{value[prop]}</td>
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
