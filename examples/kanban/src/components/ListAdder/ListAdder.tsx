import * as React from "react";
import Textarea from "react-textarea-autosize";
import * as shortid from "shortid";
import { dispatch, state } from "../../model";
import "./ListAdder.scss";

interface Props {
  boardId: string;
}

function addList(boardId: string, listId: string, listTitle: string) {
  state.boardsById[boardId].lists.push(listId);
  state.listsById[listId] = {
    _id: listId,
    title: listTitle,
    cards: [],
  };
}

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
    if (listTitle === "") {
      return;
    }
    const listId = shortid.generate();
    dispatch(addList)(boardId, listId, listTitle);
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
