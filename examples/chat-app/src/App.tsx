import * as React from "react";
import { Message as MessageModel, model } from "./model";
import moment from "moment";

const saveMessage = model.action(({ db }) => async (text: string) => {
  db.messages.insert({
    text,
    date: Date.now(),
  });
});

const deleteMessage = model.action(({ db }) => async (id: string) => {
  await db.messages.delete(id);
});

const Message = model.connect(
  ({ dispatch }) => ({
    message,
  }: {
    message: MessageModel & { id: string };
  }) => (
    <div className="message center">
      <span className="date">{moment(message.date).fromNow()}</span>
      <span className="text">{message.text}</span>
      <span className="delete">
        <button onClick={() => dispatch(deleteMessage)(message.id)}>
          delete
        </button>
      </span>
    </div>
  ),
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
  const [showMessages, setShowMessages] = React.useState(true);

  const toggleShowMessages = () => {
    setShowMessages(!showMessages);
  };

  return (
    <div className="app">
      <div className="full">
        <h1 className="title">the chat app</h1>

        <div className="buttons center">
          <button onClick={() => toggleShowMessages()}>
            {showMessages ? "Hide" : "Show"}
          </button>
        </div>

        {showMessages && <Messages />}
      </div>
      <Input />
    </div>
  );
});

export default App;
