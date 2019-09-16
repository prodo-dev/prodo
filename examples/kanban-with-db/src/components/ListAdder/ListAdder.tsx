import * as React from "react";
import Textarea from "react-textarea-autosize";
import "./ListAdder.scss";
import { dispatch, db } from "../../model";

type Props = {
  boardId: string;
};

const addList = async (boardId: string, listTitle: string) => {
  const listId = await db.listsById.insert({
    title: listTitle,
    cards: [],
  });
  const board = await db.boardsById.get(boardId);
  await db.boardsById.update(boardId, {
    lists: board.lists.concat([listId]),
  });
};

function ListAdder({ boardId }: Props) {
  const [localState, setLocalState] = React.useState({
    isOpen: false,
    listTitle: "",
  });
  const { isOpen, listTitle } = localState;
  const handleBlur = () => {
    setLocalState({ ...localState, isOpen: false });
  };
  const handleChange = (event: any) => {
    setLocalState({ ...localState, listTitle: event.target.value });
  };
  const handleKeyDown = (event: any) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      handleSubmit();
    } else if (event.keyCode === 27) {
      setLocalState({ isOpen: false, listTitle: "" });
    }
  };
  const handleSubmit = () => {
    if (listTitle === "") return;
    dispatch(addList)(boardId, listTitle);
    setLocalState({ isOpen: false, listTitle: "" });
  };
  if (!isOpen) {
    return (
      <button
        onClick={() => setLocalState({ ...localState, isOpen: true })}
        className="add-list-button"
      >
        Add a new list...
      </button>
    );
  }
  return (
    <div className="list">
      <Textarea
        autoFocus
        useCacheForDOMMeasurements
        value={localState.listTitle}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="list-adder-textarea"
        onBlur={handleBlur}
        spellCheck={false}
      />
    </div>
  );
}

export default ListAdder;
