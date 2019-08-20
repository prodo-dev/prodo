import * as React from "react";
import { render, initialState } from "./store";
import App from "./App";

import "./index.scss";

render({ initialState })(<App />, document.getElementById("root"));
