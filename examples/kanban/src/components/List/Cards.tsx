import * as React from "react";
import { Droppable } from "react-beautiful-dnd";
import { state, watch } from "../../model";
import Card from "../Card/Card";
import { usePrevValue } from "../utils";

interface Props {
  listId: string;
}

function Cards({ listId }: Props) {
  const cards = watch(state.listsById[listId].cards);
  const listEnd = React.useRef<HTMLDivElement>();

  const scrollToBottom = React.useCallback(() => {
    if (listEnd.current) {
      listEnd.current.scrollIntoView();
    }
  }, [listEnd]);

  const prevCards = usePrevValue(cards);
  React.useEffect(() => {
    if (
      prevCards != null &&
      prevCards[prevCards.length - 1] === cards[cards.length - 2]
    ) {
      scrollToBottom();
    }
  }, [prevCards, cards]);

  return (
    <Droppable droppableId={listId}>
      {(provided, { isDraggingOver }) => (
        <>
          <div className="cards" ref={provided.innerRef}>
            {cards.map((cardId: string, index: number) => (
              <Card
                isDraggingOver={isDraggingOver}
                key={cardId}
                cardId={cardId}
                listId={listId}
                index={index}
              />
            ))}
            {provided.placeholder}
            <div style={{ float: "left", clear: "both" }} ref={listEnd} />
          </div>
        </>
      )}
    </Droppable>
  );
}

export default Cards;
