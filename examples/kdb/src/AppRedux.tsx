import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import * as React from "react";
import { Quote, Trade } from "./types";
import Graph from "./Graph";
import Table from "./Table";
import SymbolSelector, { allSymbols } from "./Select";
import { kdbSocket, pushValues } from "./libKx";

interface State {
  symbols: { [key: string]: boolean };
  quotes: { [key: string]: Quote };
  trades: { [key: string]: Trade };
  quoteHistory: { [key: string]: Quote[] };
  tradeHistory: { [key: string]: Trade[] };
}

interface ToggleSymbol {
  type: "TOGGLE_SYMBOL";
  symbol: string;
}

interface UpdateQuotes {
  type: "UPDATE_QUOTES";
  quotes: { [key: string]: Quote };
}

interface UpdateTrades {
  type: "UPDATE_TRADES";
  trades: { [key: string]: Trade };
}

type Action = UpdateQuotes | UpdateTrades | ToggleSymbol;

const historySize = 10000;
const historyFilter = <T extends Quote | Trade>(ref: T, value: T) =>
  value.time.getTime() > ref.time.getTime() - historySize;

const reducer = (
  state: State = {
    symbols: allSymbols,
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
        quoteHistory: pushValues<Quote>(historyFilter)(
          state.quoteHistory,
          action.quotes,
        ),
      };
    case "UPDATE_TRADES":
      return {
        ...state,
        trades: action.trades,
        tradeHistory: pushValues<Trade>(historyFilter)(
          state.tradeHistory,
          action.trades,
        ),
      };
    case "TOGGLE_SYMBOL":
      return {
        ...state,
        symbols: {
          ...state.symbols,
          [action.symbol]: !state.symbols[action.symbol],
        },
      };
  }
  return state;
};

const updateQuotes = (quotes: { [key: string]: Quote }) => ({
  type: "UPDATE_QUOTES",
  quotes,
});

const updateTrades = (trades: { [key: string]: Trade }) => ({
  type: "UPDATE_TRADES",
  trades,
});

const toggleSymbol = (symbol: string) => ({
  type: "TOGGLE_SYMBOL",
  symbol,
});

const ConnectedGraph = connect(
  ({ quoteHistory, tradeHistory }: State, { idx }: { idx: string }) => ({
    quoteHistory: quoteHistory[idx] || [],
    tradeHistory: tradeHistory[idx] || [],
    historySize,
  }),
)(Graph);

const Trades = connect(({ trades, symbols }: State) => ({
  title: "Trades",
  data: trades,
  props: ["sym", "price", "size"] as (keyof Trade)[],
  symbols,
}))(Table as any);

const Quotes = connect(({ quotes, symbols }: State) => ({
  title: "Quotes",
  data: quotes,
  props: ["sym", "bid", "ask"] as (keyof Quote)[],
  symbols,
}))(Table as any);

const App = ({
  updateQuotes,
  updateTrades,
  toggleSymbol,
  symbols,
}: {
  updateQuotes: (quotes: { [key: string]: Quote }) => void;
  updateTrades: (trades: { [key: string]: Trade }) => void;
  toggleSymbol: (name: string) => void;
  symbols: { [key: string]: boolean };
}) => {
  React.useEffect(() => {
    const { quotes, trades } = kdbSocket();
    quotes.forEach(quotes => updateQuotes(quotes));
    trades.forEach(trades => updateTrades(trades));
  }, []);

  return (
    <>
      <SymbolSelector symbols={symbols} toggleSymbol={toggleSymbol} />
      <Trades />
      <Quotes />
      {Object.entries(symbols)
        .filter(([_, value]) => value)
        .map(([sym, _]) => (
          <ConnectedGraph idx={sym} key={sym} />
        ))}
    </>
  );
};

const ConnectedApp = connect(
  ({ symbols }: State) => ({ symbols }),
  dispatch => ({
    updateQuotes: (quotes: { [key: string]: Quote }) => {
      dispatch(updateQuotes(quotes));
    },
    updateTrades: (trades: { [key: string]: Trade }) => {
      dispatch(updateTrades(trades));
    },
    toggleSymbol: (name: string) => {
      dispatch(toggleSymbol(name));
    },
  }),
)(App);

const store = createStore(reducer);

export default () => (
  <Provider store={store}>
    <ConnectedApp />
  </Provider>
);
