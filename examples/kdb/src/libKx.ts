import { KxEvent, KxQuote, KxTrade, Quote, Trade } from "./model";
import { webSocket } from "rxjs/webSocket";
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

export const kdbSocket = (url: string = "ws://localhost:5001") => {
  const ws = webSocket<Msg | string>({
    url,
    serializer: msg => (typeof msg === "string" ? msg : JSON.stringify(msg)),
  });
  ws.next("loadPage[]");

  const quotes = ws.pipe(
    op.filter(filterQuotes),
    op.map(({ result }): { [key: string]: Quote } => parseEvents(result)),
  );
  const trades = ws.pipe(
    op.filter(filterTrades),
    op.map(({ result }): { [key: string]: Trade } => parseEvents(result)),
  );

  return { quotes, trades };
};
