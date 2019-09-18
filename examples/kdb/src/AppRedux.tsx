import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import * as React from "react";
import { Quote, Trade } from "./types";
import Graph from "./Graph";
import Table from "./Table";
import { kdbSocket, pushValues } from "./libKx";

interface State {
  quotes: { [key: string]: Quote };
  trades: { [key: string]: Trade };
  quoteHistory: { [key: string]: Quote[] };
  tradeHistory: { [key: string]: Trade[] };
}

interface UpdateQuotes {
  type: "UPDATE_QUOTES";
  quotes: { [key: string]: Quote };
}

interface UpdateTrades {
  type: "UPDATE_TRADES";
  trades: { [key: string]: Trade };
}

type Action = UpdateQuotes | UpdateTrades;

const historySize = 10;

const reducer = (
  state: State = {
    quotes: {},
    trades: {},
    tradeHistory: {},
    quoteHistory: {},
  },
  action: Action,
): State => {
  switch (action.type) {
    case "UPDATE_QUOTES":
      return {
        ...state,
        quotes: action.quotes,
        quoteHistory: pushValues<Quote>(historySize)(
          state.quoteHistory,
          action.quotes,
        ),
      };
    case "UPDATE_TRADES":
      return {
        ...state,
        trades: action.trades,
        tradeHistory: pushValues<Trade>(historySize)(
          state.tradeHistory,
          action.trades,
        ),
      };
  }
  return state;
};

const updateQuotes = (quotes: {[key: string]: Quote}) => ({
  type: "UPDATE_QUOTES",
  quotes,
});

const updateTrades = (trades: {[key: string]: Trade}) => ({
  type: "UPDATE_TRADES",
  trades,
});

const ConnectedGraph = connect(
  ({ quoteHistory, tradeHistory }: State, { idx }: { idx: string }) => ({
    quoteHistory: quoteHistory[idx] || [],
    tradeHistory: tradeHistory[idx] || [],
  }),
)(Graph);

const Trades = connect(({ trades }: State) => ({
  title: "Trades",
  data: trades,
  props: ["sym", "price", "size"] as (keyof Trade)[],
}))(Table as any);

const Quotes = connect(({ quotes }: State) => ({
  title: "Quotes",
  data: quotes,
  props: ["sym", "bid", "ask"] as (keyof Quote)[],
}))(Table as any);

const App = ({
  updateQuotes,
  updateTrades,
}: {
  updateQuotes: (quotes: {[key: string]: Quote}) => void;
  updateTrades: (trades: {[key: string]: Trade}) => void;
}) => {
  React.useEffect(() => {
    const { quotes, trades } = kdbSocket();
    quotes.forEach(quotes => updateQuotes(quotes));
    trades.forEach(trades => updateTrades(trades));
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
};

const ConnectedApp = connect(
  () => ({}),
  dispatch  => ({
    updateQuotes: (quotes: {[key: string]: Quote}) => {
      dispatch(updateQuotes(quotes));
    },
    updateTrades: (trades: {[key: string]: Trade}) => {
      dispatch(updateTrades(trades));
    },
  }),
)(App);

const store = createStore(reducer);

export default () => (
  <Provider store={store}>
    <ConnectedApp />
  </Provider>
);
