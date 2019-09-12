import * as React from "react";
import { db, dispatch } from "./model";

import "@babel/polyfill";

const saveStuff = async (text: string) => {
  db.stuff.insert({
    text,
    date: Date.now(),
  });
};

const App = () => {
  return <button onClick={() => dispatch(saveStuff)("data")}> save </button>;
};

export default App;
