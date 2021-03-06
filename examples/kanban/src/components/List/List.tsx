import classnames from "classnames";
import * as React from "react";
import { Draggable } from "react-beautiful-dnd";
import { List as _List } from "../../types";
import CardAdder from "../CardAdder/CardAdder";
import Cards from "./Cards";
import "./List.scss";
import ListHeader from "./ListHeader";

interface Props {
  boardId: string;
  index: number;
  list: _List;
}

function List({ boardId, index, list }: Props) {
  return (
    <Draggable
      draggableId={list._id}
      index={index}
      disableInteractiveElementBlocking
    >
      {(provided, snapshot) => (
        <>
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className="list-wrapper"
          >
            <div
              className={classnames("list", {
                "list--drag": snapshot.isDragging,
              })}
            >
              <ListHeader
                dragHandleProps={provided.dragHandleProps}
                listTitle={list.title}
                listId={list._id}
                cards={list.cards}
                boardId={boardId}
              />
              <div className="cards-wrapper">
                <Cards listId={list._id} />
              </div>
            </div>
            <CardAdder listId={list._id} />
          </div>
          {provided.placeholder}
        </>
      )}
    </Draggable>
  );
}

export default List;
