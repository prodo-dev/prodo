import moment from "moment";
import * as React from "react";
import { Message as MessageModel, model } from "./model";

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

const Messages = model.connect(({ db }) => ({ query }: { query: string }) => {
  const data =
    query === ""
      ? db.messages.watchAll()
      : db.messages.watchAll({ where: [["text", "==", query]] });

  return (
    <div className="messages">
      {data._fetching ? (
        <h1 className="status center">Fetching...</h1>
      ) : data._notFound ? (
        <h1 className="status center">Collection not found</h1>
      ) : (
        data.data
          .sort((a, b) => a.date - b.date)
          .map(message => <Message message={message} key={message.id} />)
      )}
    </div>
  );
});

const QueryMessages = model.connect(({}) => () => {
  const [query, setQuery] = React.useState<string>("");
  const [showMessages, setShowMessages] = React.useState(true);

  return (
    <div className="query">
      <div className="top-bar center">
        <button onClick={() => setShowMessages(!showMessages)}>
          {showMessages ? "Hide" : "Show"}
        </button>
        <input
          type="text"
          placeholder="Filter messages"
          onKeyUp={(e: any) => {
            if (e.keyCode === 13) {
              setQuery(e.target.value);
            }
          }}
        />
      </div>

      {showMessages && <Messages query={query} />}
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

const NewChatMessage = model.connect(({ dispatch }) => () => (
  <div className="new-chat-message">
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

        <div className="queries">
          <QueryMessages />
          <QueryMessages />
          <QueryMessages />
        </div>
      </div>
      <NewChatMessage />
    </div>
  );
});

export default App;
