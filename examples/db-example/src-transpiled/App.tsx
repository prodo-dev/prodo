import * as React from "react";
import { model, db, dispatch } from "./model";
const saveStuff = model.action(
  ({ db, dispatch }) => async (text: string) => {
    db.stuff.insert({
      text,
      date: Date.now()
    });
  },
  "saveStuff"
);
const App = model.connect(
  ({ db, dispatch }) => () => {
    return <button onClick={() => dispatch(saveStuff)("data")}> save </button>;
  },
  "App"
);
export default App;
