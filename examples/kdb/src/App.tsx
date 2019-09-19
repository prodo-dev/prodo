import * as React from "react";
import { Quote, Trade } from "./types";
import Graph from "./Graph";
import Table from "./Table";
import { kdbSocket, scanHistory } from "./libKx";
import { createModel } from "@prodo/core";
import SymbolSelector, { allSymbols } from "./Select";
import streamPlugin, { Stream } from "@prodo/stream-plugin";
import * as op from "rxjs/operators";

interface State {
  symbols: { [key: string]: boolean };
}

interface Streams {
  quotes: Stream<{ [key: string]: Quote }>;
  trades: Stream<{ [key: string]: Trade }>;
  quoteHistory: Stream<{ [key: string]: Quote[] }>;
  tradeHistory: Stream<{ [key: string]: Trade[] }>;
}

export const historySize = 10000;
const model = createModel<State>().with(streamPlugin<Streams>());

const setupStreams = model.action(
  ({ streams }) => () => {
    const { quotes, trades } = kdbSocket();
    streams.quotes = quotes;
    streams.trades = trades;

    streams.quoteHistory = quotes.pipe(
      op.scan(scanHistory(historySize), {} as { [key: string]: Quote[] }),
    );
    streams.tradeHistory = trades.pipe(
      op.scan(scanHistory(historySize), {} as { [key: string]: Trade[] }),
    );
  },
  "setupStreams",
);

const toggleSymbol = model.action(
  ({ state }) => (name: string) => {
    state.symbols[name] = !state.symbols[name];
  },
  "toggleSymbol",
);

const Trades = model.connect(
  ({ state, streams, watch }) => () => (
    <Table
      title="trades"
      data={watch(streams.trades) || {}}
      symbols={watch(state.symbols)}
      props={["sym", "price", "size"]}
    />
  ),
  "Trades",
);

const Quotes = model.connect(
  ({ state, streams, watch }) => () => (
    <Table
      title="quotes"
      data={watch(streams.quotes) || {}}
      symbols={watch(state.symbols)}
      props={["sym", "bid", "ask"]}
    />
  ),
  "Quotes",
);

const ConnectedGraph = model.connect(
  ({ streams, watch }) => ({ idx }: { idx: string }) => {
    const quoteHistory = watch(streams.quoteHistory![idx]) || [];
    const tradeHistory = watch(streams.tradeHistory![idx]) || [];
    return <Graph {...{ quoteHistory, tradeHistory, historySize }} />;
  },
  "Graph",
);

const App = model.connect(
  ({ state, dispatch, watch }) => () => {
    React.useEffect(() => {
      console.log("using Prodo");
      dispatch(setupStreams)();
    }, []);
    const symbols = watch(state.symbols);

    return (
      <>
        <SymbolSelector
          symbols={symbols}
          toggleSymbol={name => dispatch(toggleSymbol)(name)}
        />
        <Trades />
        <Quotes />
        {Object.entries(symbols)
          .filter(([_, value]) => value)
          .map(([sym, _]) => (
            <ConnectedGraph idx={sym} key={sym} />
          ))}
      </>
    );
  },
  "App",
);

const { Provider } = model.createStore({ initState: { symbols: allSymbols } });

export default () => (
  <Provider>
    <App />
  </Provider>
);
