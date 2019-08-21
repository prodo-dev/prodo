import * as React from "react";
import { setupStreams } from "./actions";
import App from "./App";
import { initialState, render } from "./store";

import "./index.scss";

const { dispatch } = render({ initialState })(
  <App />,
  document.getElementById("root"),
);

dispatch(setupStreams)({});
