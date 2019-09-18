import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import "./BoardTitle.scss";
import { dispatch, db } from "../../model";
import Spinner from "../Spinner/Spinner";
import NotFound from "../NotFound/NotFound";

interface Params {
  boardId: string;
}

const changeBoardTitle = (boardId: string, title: string) => {
  db.boardsById.update(boardId, { title });
};

function BoardTitle({ match }: RouteComponentProps<Params>) {
  const { boardId } = match.params;
  const board = db.boardsById.watch(boardId);
  if (board._fetching) return <Spinner />;
  if (board._notFound) return <NotFound missing={`boardsById.${boardId}`} />;
  const boardTitle = board.data.title;
  const [isOpen, setOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState(boardTitle);

  const handleClick = () => setOpen(true);

  const handleChange = (event: any) => setNewTitle(event.target.value);

  const submitTitle = () => {
    if (newTitle === "") return;
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

export default withRouter(BoardTitle);
