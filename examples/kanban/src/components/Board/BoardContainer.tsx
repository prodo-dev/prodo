import * as React from "react";
import { Redirect } from "react-router";
import Board from "./Board";
import { state, watch } from "../../model";

type Props = {
  match: {
    params: { boardId: string };
  };
};

// This components only purpose is to redirect requests for board pages that don't exist
// or which the user is not authorized to visit, in order to prevent errors
function BoardContainer({ match }: Props) {
  const { boardId } = match.params;
  return boardId ? <Board boardId={boardId} /> : <Redirect to="/" />;
}

export default BoardContainer;
