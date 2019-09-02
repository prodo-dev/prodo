import * as React from "react";
import { Message as MessageModel, model } from "./model";
import moment from "moment";

const saveMessage = model.action(({ db }) => async (text: string) => {
  db.messages.insert({
    text,
    id: Math.random().toString(),
    date: Date.now(),
  });
});

const Message: React.FC<{ message: MessageModel }> = ({ message }) => (
  <div className="message center">
    <span className="date">{moment(message.date).fromNow()}</span>
    <span className="text">{message.text}</span>
  </div>
);

const Messages = model.connect(({ db }) => () => {
  const data = db.messages.watchAll();

  return (
    <div className="messages">
      {data._fetching ? (
        <h1 className="center">Fetching...</h1>
      ) : data._notFound ? (
        <h1 className="center">Collection not found</h1>
      ) : (
        data.data
          .sort((a, b) => a.date - b.date)
          .map(message => <Message message={message} key={message.id} />)
      )}
    </div>
  );
});

const words = [
  "funny",
  "clever",
  "smart",
  "interesting",
  "silly",
  "meaningful",
];

const Input = model.connect(({ dispatch }) => () => (
  <div className="input">
    <input
      placeholder={`Something ${
        words[Math.floor(Math.random() * words.length)]
      }...`}
      type="text"
      onKeyUp={(e: any) => {
        if (e.keyCode === 13) {
          dispatch(saveMessage)(e.target.value);
          e.target.value = "";
        }
      }}
    />
  </div>
));

const App = model.connect(({}) => () => {
  return (
    <div className="app">
      <div className="full">
        <h1 className="title">the chat app</h1>
        <Messages />
      </div>
      <Input />
    </div>
  );
});

export default App;
