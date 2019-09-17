import { Redirect } from "@prodo/route";
import * as React from "react";
import { state, watch } from "../../model";
import Board from "./Board";

// This components only purpose is to redirect requests for board pages that don't exist
// or which the user is not authorized to visit, in order to prevent errors
interface Props {
  boardId: string;
}

function BoardContainer({ boardId }: Props) {
  const board = watch(state.boardsById[boardId]);
  return board ? <Board boardId={boardId} /> : <Redirect to="/" />;
}

export default BoardContainer;
