import * as React from "react";
import { deleteAll, deleteItem, newTodo, toggle } from "./actions";
import { model } from "./model";

export const List = model.connect(
  ({ state, watch }) => () => (
    <ul data-testid="list">
      {Object.keys(watch(state.todos)).map(id => (
        <Item key={id} id={id} />
      ))}
    </ul>
  ),
  "List",
);

export const Item = model.connect(
  ({ state, watch, dispatch }) => ({ id }: { id: string }) => (
    <li data-testid="item">
      <input
        type="checkbox"
        checked={watch(state.todos[id].done)}
        onChange={() => dispatch(toggle)(id)}
      />
      <span className="item-text">{watch(state.todos[id].text)}</span>
      <button onClick={() => dispatch(deleteItem)(id)}>x</button>
    </li>
  ),
  "Item",
);

export const NewTodo = model.connect(
  ({ dispatch }) => () => (
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
  ),
  "NewTodo",
);

export const Buttons = model.connect(
  ({ dispatch }) => () => (
    <div className="buttons">
      <button
        onClick={() => {
          dispatch(deleteAll)({});
        }}
      >
        delete all
      </button>
    </div>
  ),
  "Buttons",
);

const App = () => (
  <div className="app">
    <h1 className="title">Todos</h1>
    <NewTodo />
    <List />
    <Buttons />
  </div>
);

export default App;
