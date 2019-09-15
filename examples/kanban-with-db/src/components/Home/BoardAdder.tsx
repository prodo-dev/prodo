import * as React from "react";
import slugify from "slugify";
import ClickOutside from "../ClickOutside/ClickOutside";
import { state, dispatch, db } from "../../model";
import { withRouter } from "react-router-dom";

type Props = {
  history: any;
};

const addBoard = async (title: string, historyPush: any) => {
  const user = await db.users.get(state.userId);
  const boardId = await db.boardsById.insert({
    title,
    lists: [],
    users: [state.userId],
    color: "blue",
  });
  user.boards.push(boardId);
  db.users.set(state.userId, { boards: user.boards });
  state.currentBoardId = boardId;
  setTimeout(() => {
    const urlSlug = slugify(title, { lower: true });
    historyPush(`/b/${boardId}/${urlSlug}`);
  }, 100);
};

function BoardAdder({ history }: Props) {
  const [localState, setLocalState] = React.useState({
    isOpen: false,
    title: "",
  });
  const { isOpen, title } = localState;

  const toggleOpen = () => {
    setLocalState({ ...localState, isOpen: !isOpen });
  };

  const handleChange = (event: any) => {
    setLocalState({ ...localState, title: event.target.value });
  };

  const handleSubmit = (event: any) => {
    // Dispatch action to put new empty board in redux store and db + push new url to history
    event.preventDefault();
    if (title === "") {
      return;
    }
    dispatch(addBoard)(title, history.push);
    setLocalState({ isOpen: false, title: "" });
  };

  const handleKeyDown = (event: any) => {
    if (event.keyCode === 27) {
      setLocalState({ ...localState, isOpen: false });
    }
  };

  return isOpen ? (
    <ClickOutside handleClickOutside={toggleOpen}>
      <form onSubmit={handleSubmit} className="board-adder">
        <input
          autoFocus
          className="submit-board-input"
          type="text"
          value={title}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          spellCheck={false}
        />
        <input
          type="submit"
          value="Create"
          className="submit-board-button"
          disabled={title === ""}
        />
      </form>
    </ClickOutside>
  ) : (
    <button onClick={toggleOpen} className="add-board-button">
      Add a new board...
    </button>
  );
}

export default withRouter(BoardAdder);
