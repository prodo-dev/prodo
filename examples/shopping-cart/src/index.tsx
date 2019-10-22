import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { model } from "./model";
import { createBrowserHistory } from "history";

import "./styles.css";
import { getAllProducts } from "./actions/product";

const history = createBrowserHistory();

const { Provider, store } = model.createStore({
  logger: true,
  route: {
    history,
  },
  initState: {
    total: 0,
    products: [],
    carts: [],
  },
});
const render = () => {
  ReactDOM.render(
    <Provider>
      <App />
    </Provider>,
    document.getElementById("root"),
  );
};

if (module.hot) {
  module.hot.accept("./App", () => {
    render();
  });
}

render();

store.dispatch(getAllProducts)()