import { KxEvent, KxQuote, KxTrade, Quote, Trade } from "./types";
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
  const [hour, min, sec, ms] = date
    .slice(2, 14)
    .split(/:|\./)
    .map(i => parseInt(i, 10));
  out.setHours(hour, min, sec, ms);
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
    op.distinct(trades => Object.values(trades)[0].time.getTime() || NaN),
  );

  return { quotes, trades };
};

export const pushValues = <T>(test: (ref: T, value: T) => boolean) => (
  acc: { [key: string]: T[] },
  value: { [key: string]: T },
): { [key: string]: T[] } =>
  Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      const old = acc[k] || [];
      const idx = old.findIndex(o => test(v, o));
      return [k, [...old.slice(idx), v]];
    }),
  );
