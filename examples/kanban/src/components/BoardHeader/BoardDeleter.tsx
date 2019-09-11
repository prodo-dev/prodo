import * as React from "react";
import { withRouter } from "react-router-dom";
import { Button, Wrapper, Menu, MenuItem } from "react-aria-menubutton";
// @ts-ignore
import FaTrash from "react-icons/lib/fa/trash";
import "./BoardDeleter.scss";
import { state, dispatch } from "../../model";

type Props = {
  match: {
    params: {
      boardId: string;
    };
  };
  history: { push: Function };
};

function deleteBoard(boardId) {
  delete state.boardsById[boardId];
}

function BoardDeleter({ match, history }: Props) {
  const handleSelection = () => {
    const { boardId } = match.params;
    dispatch(deleteBoard)(boardId);
    history.push("/");
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

export default withRouter(BoardDeleter);
