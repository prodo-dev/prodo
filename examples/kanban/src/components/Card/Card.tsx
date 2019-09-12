import * as React from "react";
import { Draggable } from "react-beautiful-dnd";
import classnames from "classnames";
import CardModal from "../CardModal/CardModal";
import CardBadges from "../CardBadges/CardBadges";
import formatMarkdown from "./formatMarkdown";
import { findCheckboxes } from "../utils";
import Spinner from "../Spinner/Spinner";
import { state, watch, db } from "../../model";
import { Card as _Card } from "../../types";
import "./Card.scss";

const toggleCheckbox = (card: _Card, checked: boolean, i: number) => {
  // identify the clicked checkbox by its index and give it a new checked attribute
  const { id, text } = card;
  let j = 0;
  const newText = text.replace(/\[(\s|x)\]/g, match => {
    const newString = i !== j ? match : checked ? "[x]" : "[ ]";
    j += 1;
    return newString;
  });
  db.cardsById.set(id, { ...card, text: newText });
};

type Props = {
  cardId: string;
  listId: string;
  isDraggingOver: boolean;
  index: number;
};

export function Card({ cardId, listId, isDraggingOver, index }: Props) {
  const cards = db.cardsById.watchAll({ where: [["id", "==", cardId]] });
  if (cards._fetching) return <Spinner />;
  if (cards._notFound || cards.data.length === 0) return <div>NOT FOUND</div>;

  console.log("CARDS", cards);

  const card = cards.data[0];
  const [isModalOpen, setModalOpen] = React.useState(false);
  const toggleCardEditor = () => setModalOpen(!isModalOpen);
  const checkboxes = findCheckboxes(card.text);
  const _ref = React.useRef(undefined);
  return (
    <>
      <Draggable draggableId={card.id} index={index}>
        {(provided, snapshot) => (
          <>
            <div
              className={classnames("card-title", {
                "card-title--drag": snapshot.isDragging,
              })}
              ref={ref => {
                provided.innerRef(ref);
                _ref.current = ref;
              }}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              onClick={(event: any) => {
                const { tagName, checked, id } = event.target;
                if (tagName.toLowerCase() === "input") {
                  // The id is a string that describes which number in the order of checkboxes this particular checkbox has
                  toggleCheckbox(card, checked, parseInt(id, 10));
                } else if (tagName.toLowerCase() !== "a") {
                  toggleCardEditor();
                }
                event.preventDefault();
              }}
              onMouseDown={(event: any) => {
                provided.dragHandleProps.onMouseDown(event);
                event.preventDefault();
              }}
              onKeyDown={(event: any) => {
                provided.dragHandleProps.onKeyDown(event);
                // Only open card on enter since spacebar is used by react-beautiful-dnd for keyboard dragging
                if (
                  event.keyCode === 13 &&
                  event.target.tagName.toLowerCase() !== "a"
                ) {
                  event.preventDefault();
                  toggleCardEditor();
                }
              }}
              style={{
                ...provided.draggableProps.style,
                background: card.color,
              }}
            >
              <div
                className="card-title-html"
                dangerouslySetInnerHTML={{
                  __html: formatMarkdown(card.text),
                }}
              />
              {(card.date || checkboxes.total > 0) && (
                <CardBadges date={card.date} checkboxes={checkboxes} />
              )}
            </div>
            {/* Remove placeholder when not dragging over to reduce snapping */}
            {isDraggingOver && provided.placeholder}
          </>
        )}
      </Draggable>
      <CardModal
        isOpen={isModalOpen}
        cardElement={_ref.current}
        card={card}
        listId={listId}
        toggleCardEditor={toggleCardEditor}
      />
    </>
  );
}

export default Card;
