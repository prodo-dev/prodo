import * as React from "react";
import styled from "styled-components";
import { deleteAll, deleteItem, newTodo, toggle } from "./actions";
import { dispatch, state, watch } from "./model";

export const List = () => (
  <ul data-testid="list">
    {Object.keys(watch(state.todos)).map(id => (
      <Item key={id} id={id} />
    ))}
  </ul>
);

export const Item = ({ id }: { id: string }) => {
  const { done, emoji, text } = watch(state.todos[id]);
  return (
    <li data-testid="item">
      <input
        type="checkbox"
        checked={done}
        onChange={() => dispatch(toggle)(id)}
      />
      <span className="item-text" style={{ opacity: done ? 0.3 : 1 }}>
        {text} <Emoji str={emoji} />
      </span>
      <button onClick={() => dispatch(deleteItem)(id)}>x</button>
    </li>
  );
};

export const Emoji = ({ str }: { str?: string }) => (
  <span dangerouslySetInnerHTML={{ __html: str || "" }} />
);

export const NewTodo = () => (
  <input
    aria-label="item-input"
    type="text"
    placeholder="What needs to be done?"
    onKeyUp={(e: any) => {
      if (e.keyCode === 13) {
        dispatch(newTodo)(e.target.value);
        e.target.value = "";
      }
    }}
  />
);

export const Buttons = () => (
  <div className="buttons">
    <button
      onClick={() => {
        dispatch(deleteAll)();
      }}
    >
      delete all
    </button>
  </div>
);

const Title = styled.h1`
  color: pink;
`;

const App = () => (
  <div className="app">
    <Title className="title">Todos</Title>
    <NewTodo />
    <List />
    <Buttons />
  </div>
);

export default App;
