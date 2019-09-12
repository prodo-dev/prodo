import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "react-error-boundary";
import App from "./components/App";
import "./styles.scss";
import { model } from "./model";
import "@babel/polyfill";

const { store, Provider } = model.createStore({
  logger: true,
  firebaseConfig: {
    apiKey: "AIzaSyCE2ju9-hUB20T4l8gW_OswSdTRz0jHO54",
    authDomain: "db-example-142j3.firebaseapp.com",
    databaseURL: "https://db-example-142j3.firebaseio.com",
    projectId: "db-example-142j3",
    storageBucket: "db-example-142j3.appspot.com",
    messagingSenderId: "269426456584",
    appId: "1:269426456584:web:899ccf22d228cf05a839bd",
  },
  initState: {
    user: {
      _id: "ted",
      name: "ted",
      imageUrl: "https://profiles.utdallas.edu/img/default.png",
    },
    currentBoardId: "B1",
    // boardsById: {
    //   B1: {
    //     _id: "B1",
    //     title: "todos",
    //     color: "blue",
    //     lists: ["L1", "L2"],
    //     users: ["ted"],
    //   },
    // },
    // listsById: {
    //   L1: { _id: "L1", title: "doing", cards: ["C1", "C2"] },
    //   L2: {
    //     _id: "L2",
    //     title: "done-ish",
    //     cards: ["C3", "M0zOwZpuqz2jeM3lgauY"],
    //   },
    // },
    // cardsById: {
    //   C1: { _id: "C1", text: "Hello", date: new Date(), color: "white" },
    //   C2: { _id: "C2", text: "World", date: new Date(), color: "green" },
    //   C3: { _id: "C3", text: "everything", date: new Date(), color: "blue" },
    // },
  },
});

(window as any).store = store;

ReactDOM.render(
  <ErrorBoundary>
    <BrowserRouter>
      <Provider>
        <App />
      </Provider>
    </BrowserRouter>
  </ErrorBoundary>,
  document.getElementById("root"),
);
