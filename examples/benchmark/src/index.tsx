// tslint:disable:no-console

import * as React from "react";
import * as ReactDOM from "react-dom";
import AppProdo from "./AppProdo";
import AppRedux from "./AppRedux";

import "./index.scss";

const render = () => {
  ReactDOM.render(
    <>
      <AppProdo />
      <AppRedux />
    </>,
    document.getElementById("root"),
  );
};

if (module.hot) {
  module.hot.accept("./AppProdo", () => {
    render();
  });
}

render();
