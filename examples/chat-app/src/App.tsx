import moment from "moment";
import * as React from "react";
import { db, dispatch, Message as MessageModel, state, watch } from "./model";

const saveMessage = async (text: string) => {
  db.messages.insert({
    text,
    date: Date.now(),
  });
};

const deleteMessage = async (id: string) => {
  await db.messages.delete(id);
};

const pinMessage = (id?: string) => {
  state.pinnedMessage = id;
};

const Message = ({ message }: { message: MessageModel & { id: string } }) => (
  <div className="message center">
    <span className="date">{moment(message.date).fromNow()}</span>
    <span className="text">{message.text}</span>
    <span className="message-buttons">
      <button onClick={() => dispatch(pinMessage)(message.id)}>pin</button>
      <button onClick={() => dispatch(deleteMessage)(message.id)}>
        delete
      </button>
    </span>
  </div>
);

const Messages = ({ query }: { query: string }) => {
  const data =
    query === ""
      ? db.messages.watchAll({ orderBy: [["date"]] })
      : db.messages.watchAll({
          where: [["text", "==", query]],
          orderBy: [["date"]],
        });

  return (
    <div className="messages">
      {data._fetching ? (
        <h1 className="status center">Fetching...</h1>
      ) : data._notFound ? (
        <h1 className="status center">Collection not found</h1>
      ) : (
        data.data.map(message => <Message message={message} key={message.id} />)
      )}
    </div>
  );
};

const QueryMessages = () => {
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
};

const words = [
  "funny",
  "clever",
  "smart",
  "interesting",
  "silly",
  "meaningful",
];

const NewChatMessage = () => (
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
);

const PinnedMessage = () => {
  const pinned = watch(state.pinnedMessage);

  if (!pinned) {
    return null;
  }

  return (
    <div className="pinned-message center">
      {JSON.stringify(db.messages.watch(pinned), null, 2)}
      <div>
        <button onClick={() => dispatch(pinMessage)(undefined)}>clear</button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div className="app">
      <div className="full">
        <h1 className="title">the chat app</h1>

        <PinnedMessage />

        <div className="queries">
          <QueryMessages />
          <QueryMessages />
          <QueryMessages />
        </div>
      </div>
      <NewChatMessage />
    </div>
  );
};

export default App;
