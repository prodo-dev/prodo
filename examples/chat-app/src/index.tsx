import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { model } from "./model";

import "./index.scss";

const firebaseConfig = {
  apiKey: "AIzaSyD5LzV4ugz-_1kBE3KHD8XucRr2l0ulLao",
  authDomain: "the-chat-app-4cd03.firebaseapp.com",
  databaseURL: "https://the-chat-app-4cd03.firebaseio.com",
  projectId: "the-chat-app-4cd03",
  storageBucket: "the-chat-app-4cd03.appspot.com",
  messagingSenderId: "958748877990",
  appId: "1:958748877990:web:817a83cda239bb28",
};

const { store, Provider } = model.createStore({
  initState: {},
  firebaseConfig,
});

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById("root"),
);

(window as any).store = store;
