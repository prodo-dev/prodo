import * as React from "react";
import { Quote, Trade } from "./types";
import Graph from "./Graph";
import Table from "./Table";
import { kdbSocket, pushValues } from "./libKx";
import { createModel } from "@prodo/core";
import streamPlugin, { Stream } from "@prodo/stream-plugin";
import * as op from "rxjs/operators";

interface Streams {
  quotes: Stream<{ [key: string]: Quote }>;
  trades: Stream<{ [key: string]: Trade }>;
  quoteHistory: Stream<{ [key: string]: Quote[] }>;
  tradeHistory: Stream<{ [key: string]: Trade[] }>;
}

const model = createModel<{}>().with(streamPlugin<Streams>());

const setupStreams = model.action(({ streams }) => (historySize: number) => {
  const { quotes, trades } = kdbSocket();
  streams.quotes = quotes;
  streams.trades = trades;

  streams.quoteHistory = quotes.pipe(
    op.scan(pushValues(historySize), {} as { [key: string]: Quote[] }),
  );

  streams.tradeHistory = trades.pipe(
    op.scan(pushValues(historySize), {} as { [key: string]: Trade[] }),
  );
});

const Trades = model.connect(
  ({ streams, watch }) => () => {
    const values = watch(streams.trades) || {};
    return (
      <Table title="trades" data={values} props={["sym", "price", "size"]} />
    );
  },
  "Trades",
);

const Quotes = model.connect(
  ({ streams, watch }) => () => {
    const values = watch(streams.quotes) || {};
    return <Table title="quotes" data={values} props={["sym", "bid", "ask"]} />;
  },
  "Quotes",
);

const ConnectedGraph = model.connect(
  ({ streams, watch }) => ({ idx }: { idx: string }) => {
    const quoteHistory = watch(streams.quoteHistory![idx]) || [];
    const tradeHistory = watch(streams.tradeHistory![idx]) || [];
    return <Graph quoteHistory={quoteHistory} tradeHistory={tradeHistory} />;
  },
  "Graph",
);

const App = model.connect(
  ({ dispatch }) => () => {
    React.useEffect(() => {
      dispatch(setupStreams)(10);
    }, []);

    const syms = ["BA.N", "GS.N", "IBM.N", "MSFT.O", "VOD.L"];
    return (
      <>
        <Trades />
        <Quotes />
        {syms.map(idx => (
          <ConnectedGraph idx={idx} key={idx} />
        ))}
      </>
    );
  },
  "App",
);

const { Provider } = model.createStore({ initState: {} });

export default () => (
  <Provider>
    <App />
  </Provider>
);
