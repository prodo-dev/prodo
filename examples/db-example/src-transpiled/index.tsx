import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { model } from "./model";
import "./index.scss";
var firebaseConfig = {
  apiKey: "AIzaSyCE2ju9-hUB20T4l8gW_OswSdTRz0jHO54",
  authDomain: "db-example-142j3.firebaseapp.com",
  databaseURL: "https://db-example-142j3.firebaseio.com",
  projectId: "db-example-142j3",
  storageBucket: "db-example-142j3.appspot.com",
  messagingSenderId: "269426456584",
  appId: "1:269426456584:web:899ccf22d228cf05a839bd"
};
const { store, Provider } = model.createStore({
  initState: {},
  firebaseConfig
});
ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById("root")
);
(window as any).store = store;
