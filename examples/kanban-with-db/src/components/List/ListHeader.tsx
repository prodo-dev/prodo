import * as React from "react";
import Textarea from "react-textarea-autosize";
import { Button, Wrapper, Menu, MenuItem } from "react-aria-menubutton";
// @ts-ignore
import FaTrash from "react-icons/lib/fa/trash";
import "./ListHeader.scss";

import { dispatch, db } from "../../model";

type Props = {
  listTitle: string;
  listId: string;
  boardId: string;
  cards: string[];
  dragHandleProps: any;
};

function changeListTitle(listId: string, newTitle: string) {
  db.listsById.update(listId, { title: newTitle });
}

const deleteList = async (cards: string[], listId: string, boardId: string) => {
  db.listsById.delete(listId);
  const board = await db.boardsById.get(boardId);
  db.boardsById.update(boardId, {
    lists: board.lists.filter(id => id !== listId),
  });
  cards.forEach(id => {
    db.cardsById.delete(id);
  });
};

function ListTitle({
  listTitle,
  listId,
  boardId,
  cards,
  dragHandleProps,
}: Props) {
  const [localState, setLocalState] = React.useState({
    isOpen: false,
    newTitle: listTitle,
  });
  const { isOpen, newTitle } = localState;

  const handleChange = (event: any) => {
    setLocalState({ isOpen, newTitle: event.target.value });
  };

  const handleKeyDown = (event: any) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      handleSubmit();
    } else if (event.keyCode === 27) {
      revertTitle();
    }
  };

  const handleSubmit = () => {
    if (newTitle === "") return;
    if (newTitle !== listTitle) {
      dispatch(changeListTitle)(listId, newTitle), {};
    }
    setLocalState({ isOpen: false, newTitle });
  };

  const revertTitle = () => {
    setLocalState({ newTitle: listTitle, isOpen: false });
  };

  const doDeleteList = () => {
    dispatch(deleteList)(cards, listId, boardId);
  };

  const openTitleEditor = () => {
    setLocalState({ ...localState, isOpen: true });
  };

  const handleButtonKeyDown = (event: any) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      openTitleEditor();
    }
  };

  return (
    <div className="list-header">
      {isOpen ? (
        <div className="list-title-textarea-wrapper">
          <Textarea
            autoFocus
            useCacheForDOMMeasurements
            value={newTitle}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="list-title-textarea"
            onBlur={handleSubmit}
            spellCheck={false}
          />
        </div>
      ) : (
        <div
          {...dragHandleProps}
          role="button"
          tabIndex={0}
          onClick={openTitleEditor}
          onKeyDown={event => {
            handleButtonKeyDown(event);
            dragHandleProps.onKeyDown(event);
          }}
          className="list-title-button"
        >
          {listTitle}
        </div>
      )}
      <Wrapper className="delete-list-wrapper" onSelection={doDeleteList}>
        <Button className="delete-list-button">
          <FaTrash />
        </Button>
        <Menu className="delete-list-menu">
          <div className="delete-list-header">Are you sure?</div>
          <MenuItem className="delete-list-confirm">Delete</MenuItem>
        </Menu>
      </Wrapper>
    </div>
  );
}

export default ListTitle;
