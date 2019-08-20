import * as React from "react";
import App from "./App";
import { initialState, render } from "./store";

import "./index.scss";

render({ initialState })(<App />, document.getElementById("root"));
