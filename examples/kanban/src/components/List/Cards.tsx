import * as React from "react";
import { Droppable } from "react-beautiful-dnd";
import { state, watch } from "../../model";
import Card from "../Card/Card";

interface Props {
  listId: string;
}

function Cards({ listId }: Props) {
  const cards = watch(state.listsById[listId].cards);
  React.useEffect(() => {
    // TODO: find a nice way to implement the below with hooks...
    // componentDidUpdate = prevProps => {
    //   // Scroll to bottom of list if a new card has been added
    //   if (
    //     this.props.cards[this.props.cards.length - 2] ===
    //     prevProps.cards[prevProps.cards.length - 1]
    //   ) {
    //     this.scrollToBottom();
    //   }
    // };
    // scrollToBottom = () => {
    //   this.listEnd.scrollIntoView();
    // };
  }, [cards]);
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
            <div
              style={{ float: "left", clear: "both" }}
              ref={() => {
                // TODO: handle refs...
                // this.listEnd = el;
              }}
            />
          </div>
        </>
      )}
    </Droppable>
  );
}

export default Cards;
