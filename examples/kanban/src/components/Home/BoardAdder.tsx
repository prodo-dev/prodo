import * as React from "react";
import slugify from "slugify";
import shortid from "shortid";
import ClickOutside from "../ClickOutside/ClickOutside";
import { state, dispatch, watch } from "../../model";
import { withRouter } from "react-router-dom";

type Props = {
  history: any;
};

function addBoard(boardId: string, userId: string, title: string) {
  state.boardsById[boardId] = {
    _id: boardId,
    title,
    lists: [],
    users: [userId],
    color: "blue",
  };
  state.currentBoardId = boardId;
}

function BoardAdder({ history }: Props) {
  const user = watch(state.user);
  const userId = user ? user._id : "guest";
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
    const boardId = shortid.generate();
    dispatch(addBoard)(boardId, userId, title);
    const urlSlug = slugify(title, { lower: true });
    history.push(`/b/${boardId}/${urlSlug}`);
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
