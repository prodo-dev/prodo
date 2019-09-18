import { matchRoute } from "@prodo/route";
import * as React from "react";
import { dispatch, route, state, watch } from "../../model";
import "./BoardTitle.scss";

function changeBoardTitle(boardId: string, newTitle: string) {
  state.boardsById[boardId].title = newTitle;
}

function BoardTitle() {
  const path = watch(route.path);
  const { boardId } = matchRoute(path, "/b/:boardId");
  const boardTitle = watch(state.boardsById[boardId].title);
  const [isOpen, setOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState(boardTitle);

  const handleClick = () => setOpen(true);

  const handleChange = (event: any) => setNewTitle(event.target.value);

  const submitTitle = () => {
    if (newTitle === "") {
      return;
    }
    if (boardTitle !== newTitle) {
      dispatch(changeBoardTitle)(boardId, newTitle);
    }
    setOpen(false);
  };

  const revertTitle = () => {
    setNewTitle(boardTitle);
    setOpen(false);
  };

  const handleKeyDown = (event: any) => {
    if (event.keyCode === 13) {
      submitTitle();
    } else if (event.keyCode === 27) {
      revertTitle();
    }
  };

  const handleFocus = (event: any) => {
    event.target.select();
  };

  return isOpen ? (
    <input
      autoFocus
      value={newTitle}
      type="text"
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      onBlur={revertTitle}
      onFocus={handleFocus}
      className="board-title-input"
      spellCheck={false}
    />
  ) : (
    <button className="board-title-button" onClick={handleClick}>
      <h1 className="board-title-text">{boardTitle}</h1>
    </button>
  );
}

export default BoardTitle;
