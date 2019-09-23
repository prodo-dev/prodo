import * as React from "react";
import { Button, Menu, MenuItem, Wrapper } from "react-aria-menubutton";
import FaTrash from "react-icons/lib/fa/trash";
import Textarea from "react-textarea-autosize";
import "./ListHeader.scss";

import { dispatch, state } from "../../model";

interface Props {
  listTitle: string;
  listId: string;
  boardId: string;
  cards: string[];
  dragHandleProps: any;
}

function changeListTitle(listId: string, newTitle: string) {
  state.listsById[listId].title = newTitle;
}

function deleteList(cards: string[], listId: string, boardId: string) {
  delete state.listsById[listId];
  const board = state.boardsById[boardId];
  board.lists = board.lists.filter(id => id !== listId);
  cards.forEach(id => {
    delete state.cardsById[id];
  });
}

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
    if (newTitle === "") {
      return;
    }
    if (newTitle !== listTitle) {
      dispatch(changeListTitle)(listId, newTitle);
    }
    setLocalState({ isOpen: false, newTitle });
  };

  const revertTitle = () => {
    setLocalState({ newTitle: listTitle, isOpen: false });
  };

  /* Cards need to be passed as a value to the MenuItem
  to force a re-render because of a bug in react-aria-menubutton */
  const doDeleteList = (value: string[]) => {
    dispatch(deleteList)(value, listId, boardId);
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
      <Wrapper
        className="delete-list-wrapper"
        onSelection={value => doDeleteList(value)}
      >
        <Button className="delete-list-button">
          <FaTrash />
        </Button>
        <Menu className="delete-list-menu">
          <div className="delete-list-header">Are you sure?</div>
          <MenuItem className="delete-list-confirm" value={cards}>
            Delete
          </MenuItem>
        </Menu>
      </Wrapper>
    </div>
  );
}

export default ListTitle;
