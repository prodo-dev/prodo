import * as React from "react";
import * as ReactDOM from "react-dom";
import MultiComponent from "./MultiComponent";

import "./index.scss";

const render = () => {
  ReactDOM.render(
    <>
      <MultiComponent />
    </>,
    document.getElementById("root"),
  );
};

if (module.hot) {
  module.hot.accept("./MultiComponent", () => {
    render();
  });
}

render();
