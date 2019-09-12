import * as React from "react";
import { db, state, watch, dispatch } from "./model";

import "@babel/polyfill";

const saveStuff = async (text: string) => {
  const newId = await db.stuff.insert({
    text,
    date: Date.now(),
  });
  state.lastSavedId = newId;
};

const loadLast = async () => {
  try {
    state.lastValue = await db.stuff.get(state.lastSavedId);
    state.lastLoadedId = state.lastValue.id;
    delete state.lastError;
  } catch (e) {
    state.lastError = e.message;
  }
};

const App = () => {
  return (
    <pre style={{ margin: "30px" }}>
      <div> lastSavedId = {watch(state.lastSavedId)}</div>
      <div> lastLoadedId = {watch(state.lastSavedId)}</div>
      <div> lastValue = {JSON.stringify(watch(state.lastValue))}</div>
      <div> lastError = {watch(state.lastError)}</div>
      <button onClick={() => dispatch(saveStuff)("data")}> save </button>
      <button onClick={() => dispatch(loadLast)()}> load </button>
    </pre>
  );
};

export default App;
