import * as React from "react";
import { Title } from "react-head";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import classnames from "classnames";
import List from "../List/List";
import ListAdder from "../ListAdder/ListAdder";
import Header from "../Header/Header";
import BoardHeader from "../BoardHeader/BoardHeader";
import "./Board.scss";
import { Board as _Board } from "../../types";
import { state, dispatch, db } from "../../model";

import Spinner from "../Spinner/Spinner";
import NotFound from "../NotFound/NotFound";

type Props = {
  boardId: string;
};

function setCurrentBoard(boardId) {
  state.currentBoardId = boardId;
}

const moveList = async (
  boardId: string,
  oldListIndex: number,
  newListIndex: number,
) => {
  const board = await db.boardsById.get(boardId);
  const newLists = board.lists;
  const [removedList] = newLists.splice(oldListIndex, 1);
  newLists.splice(newListIndex, 0, removedList);
  db.boardsById.set(boardId, { ...board, lists: newLists });
};

const moveCard = async (
  oldCardIndex: number,
  newCardIndex: number,
  sourceListId: string,
  destListId: string,
) => {
  if (sourceListId === destListId) {
    // Move within the same list
    const list = await db.listsById.get(sourceListId);
    const newCards = list.cards;
    const [removedCard] = newCards.splice(oldCardIndex, 1);
    newCards.splice(newCardIndex, 0, removedCard);
    db.listsById.set(sourceListId, { ...list, cards: newCards });
  } else {
    // Move card from one list to another
    const source = await db.listsById.get(sourceListId);
    const sourceCards = source.cards;
    const [removedCard] = sourceCards.splice(oldCardIndex, 1);
    const dest = await db.listsById.get(destListId);
    const destinationCards = dest.cards;
    destinationCards.splice(newCardIndex, 0, removedCard);
    db.listsById.set(sourceListId, { ...source, cards: sourceCards });
    db.listsById.set(destListId, { ...dest, cards: destinationCards });
  }
};

function Board({ boardId }: Props) {
  const boardQ = db.boardsById.watch(boardId);
  if (boardQ._fetching) return <Spinner />;
  if (boardQ._notFound) return <NotFound />;
  const board = boardQ.data;
  const boardTitle = board.title;
  const boardColor = board.color;
  const lists = board.lists.map(listId => db.listsById.watch(listId));
  const [localState, setLocalState] = React.useState({
    startX: null,
    startScrollX: null,
  });

  React.useEffect(() => {
    dispatch(setCurrentBoard)(boardId);
  }, [board]);

  const handleDragEnd = ({ source, destination, type }) => {
    // dropped outside the list
    if (!destination) {
      return;
    }
    // Move list
    if (type === "COLUMN") {
      // Prevent update if nothing has changed
      if (source.index !== destination.index) {
        dispatch(moveList)(source.droppableId, source.index, destination.index);
      }
      return;
    }
    // Move card
    if (
      source.index !== destination.index ||
      source.droppableId !== destination.droppableId
    ) {
      dispatch(moveCard)(
        source.index,
        destination.index,
        source.droppableId,
        destination.droppableId,
      );
    }
  };

  // The following three methods implement dragging of the board by holding down the mouse
  const handleMouseDown = ({ target, clientX }) => {
    if (target.className !== "list-wrapper" && target.className !== "lists") {
      return;
    }
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    setLocalState({
      startX: clientX,
      startScrollX: window.scrollX,
    });
  };

  // Go to new scroll position every time the mouse moves while dragging is activated
  const handleMouseMove = ({ clientX }) => {
    const { startX, startScrollX } = localState;
    const scrollX = startScrollX - clientX + startX;
    window.scrollTo(scrollX, 0);
    const windowScrollX = window.scrollX;
    if (scrollX !== windowScrollX) {
      setLocalState({
        ...localState,
        startX: clientX + windowScrollX - startScrollX,
      });
    }
  };

  // Remove drag event listeners
  const handleMouseUp = () => {
    if (localState.startX) {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      setLocalState({ startX: null, startScrollX: null });
    }
  };

  const handleWheel = ({ target, deltaY }) => {
    // Scroll page right or left as long as the mouse is not hovering a card-list (which could have vertical scroll)
    if (
      target.className !== "list-wrapper" &&
      target.className !== "lists" &&
      target.className !== "open-composer-button" &&
      target.className !== "list-title-button"
    ) {
      return;
    }
    // Move the board 80 pixes on every wheel event
    if (Math.sign(deltaY) === 1) {
      window.scrollTo(window.scrollX + 80, 0);
    } else if (Math.sign(deltaY) === -1) {
      window.scrollTo(window.scrollX - 80, 0);
    }
  };

  return (
    <>
      <div className={classnames("board", boardColor)}>
        <Title>{boardTitle} | React Kanban</Title>
        <Header />
        <BoardHeader />
        <div
          className="lists-wrapper"
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
        >
          <DragDropContext onDragEnd={handleDragEnd as any}>
            <Droppable
              droppableId={boardId}
              type="COLUMN"
              direction="horizontal"
            >
              {provided => (
                <div className="lists" ref={provided.innerRef}>
                  {lists.map((list, index) => {
                    if (list._fetching) return <Spinner />;
                    if (list._notFound) return <NotFound />;
                    return (
                      <List
                        list={list.data}
                        boardId={boardId}
                        index={index}
                        key={list.data.id}
                      />
                    );
                  })}
                  {provided.placeholder}
                  <ListAdder boardId={boardId} />
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div className="board-underlay" />
      </div>
    </>
  );
}

export default Board;
