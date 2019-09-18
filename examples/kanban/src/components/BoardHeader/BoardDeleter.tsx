import { matchRoute } from "@prodo/route";
import * as React from "react";
import { Button, Menu, MenuItem, Wrapper } from "react-aria-menubutton";
import FaTrash from "react-icons/lib/fa/trash";
import { dispatch, route, state, watch } from "../../model";
import "./BoardDeleter.scss";

function deleteBoard(boardId) {
  delete state.boardsById[boardId];
}

function BoardDeleter() {
  const handleSelection = () => {
    const path = watch(route.path);
    const { boardId } = matchRoute(path, "/b/:boardId");
    dispatch(deleteBoard)(boardId);
  };
  return (
    <Wrapper className="board-deleter-wrapper" onSelection={handleSelection}>
      <Button className="board-deleter-button">
        <div className="modal-icon">
          <FaTrash />
        </div>
        <div className="board-header-right-text">&nbsp;Delete board</div>
      </Button>
      <Menu className="board-deleter-menu">
        <div className="board-deleter-header">Are you sure?</div>
        <MenuItem className="board-deleter-confirm">Delete</MenuItem>
      </Menu>
    </Wrapper>
  );
}

export default BoardDeleter;
