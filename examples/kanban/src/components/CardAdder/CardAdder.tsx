import * as React from "react";
import Textarea from "react-textarea-autosize";
import * as shortid from "shortid";
import { dispatch, state } from "../../model";
import ClickOutside from "../ClickOutside/ClickOutside";
import "./CardAdder.scss";

interface Props {
  listId: string;
}

function addCard(newText: string, cardId: string, listId: string) {
  state.listsById[listId].cards.push(cardId);
  state.cardsById[cardId] = { _id: cardId, text: newText };
}

function CardAdder({ listId }: Props) {
  const [localState, setLocalState] = React.useState({
    newText: "",
    isOpen: false,
  });
  const { newText, isOpen } = localState;

  const toggleCardComposer = () => {
    setLocalState({ ...localState, isOpen: !isOpen });
  };

  const handleChange = (event: any) => {
    setLocalState({ ...localState, newText: event.target.value });
  };

  const handleKeyDown = (event: any) => {
    if (event.keyCode === 13 && event.shiftKey === false) {
      handleSubmit(event);
    } else if (event.keyCode === 27) {
      toggleCardComposer();
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (newText === "") {
      return;
    }
    const cardId = shortid.generate();
    dispatch(addCard)(newText, cardId, listId);
    toggleCardComposer();
    setLocalState({ ...localState, newText: "" });
  };

  return isOpen ? (
    <ClickOutside handleClickOutside={toggleCardComposer}>
      <form onSubmit={handleSubmit} className="card-adder-textarea-wrapper">
        <Textarea
          autoFocus
          useCacheForDOMMeasurements
          minRows={1}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={newText}
          className="card-adder-textarea"
          placeholder="Add a new card..."
          spellCheck={false}
          onBlur={toggleCardComposer}
        />
      </form>
    </ClickOutside>
  ) : (
    <button onClick={toggleCardComposer} className="add-card-button">
      +
    </button>
  );
}

export default CardAdder;
