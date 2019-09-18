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
  quotes: {[key: string]: Quote};
}

interface UpdateTrades {
  type: "UPDATE_TRADES";
  trades: {[key: string]: Trade};
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
        quoteHistory: pushValues(historySize)(state.quoteHistory, action.quotes),
      };
    case "UPDATE_TRADES":
      return {
        ...state,
        trades: action.trades,
        tradeHistory: pushValues(historySize)(state.tradeHistory, action.trades),
      };
  }
  return state;
};

const updateQuote = (quotes: Quote) => ({
  type: "UPDATE_QUOTES",
  quotes,
});

const updateTrade = (trades: Trade) => ({
  type: "UPDATE_TRADES",
  trades,
});

const ConnectedGraph = connect(({ quoteHistory, tradeHistory }, {idx}) => ({
  quoteHistory: quoteHistory[idx] || [],
  tradeHistory: tradeHistory[idx] || [],
}))(Graph);

const Trades = connect(({ trades }) => ({
   title: "Trades", data: trades, props: ["sym", "price", "size"]
}))(Table);

const Quotes = connect(({ quotes }) => ({
   title: "Quotes", data: quotes, props: ["sym", "bid", "ask"]
}))(Table);

const App = ({ updateQuote, updateTrade }) => {
  React.useEffect(() => {
    const { quotes, trades } = kdbSocket();
    quotes.forEach(quote => updateQuote(quote));
    trades.forEach(trade => updateTrade(trade));
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
  dispatch => ({
    updateQuote: quote => {
      dispatch(updateQuote(quote));
    },
    updateTrade: trade => {
      dispatch(updateTrade(trade));
    },
  }),
)(App);

const store = createStore(reducer);

export default () => (
  <Provider store={store}>
    <ConnectedApp />
  </Provider>
);
