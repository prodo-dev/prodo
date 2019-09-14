import * as React from "react";
import { Draggable } from "react-beautiful-dnd";
import classnames from "classnames";
import ListHeader from "./ListHeader";
import Cards from "./Cards";
import CardAdder from "../CardAdder/CardAdder";
import "./List.scss";
import { List as _List } from "../../types";

type Props = {
  boardId: string;
  index: number;
  list: _List;
};

function List({ boardId, index, list }: Props) {
  return (
    <Draggable
      draggableId={list.id}
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
                listId={list.id}
                cards={list.cards}
                boardId={boardId}
              />
              <div className="cards-wrapper">
                <Cards listId={list.id} />
              </div>
            </div>
            <CardAdder listId={list.id} />
          </div>
          {provided.placeholder}
        </>
      )}
    </Draggable>
  );
}

export default List;
