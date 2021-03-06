import * as React from "react";
import FaTrash from "react-icons/lib/fa/trash";
import MdAlarm from "react-icons/lib/md/access-alarm";
import Modal from "react-modal";
import colorIcon from "../../assets/images/color-icon.png";
import { dispatch, state } from "../../model";
import { Card } from "../../types";
import ClickOutside from "../ClickOutside/ClickOutside";
import Calendar from "./Calendar";
import "./CardOptions.scss";

interface Props {
  isColorPickerOpen: boolean;
  card: Card;
  isCardNearRightBorder: boolean;
  isThinDisplay: boolean;
  boundingRect: { bottom: any; left: any };
  toggleColorPicker: (...args: any[]) => any;
}

function changeCardColor(_id: string, color: string) {
  state.cardsById[_id].color = color;
}

function deleteCard(_id: string) {
  delete state.cardsById[_id];
}

function CardOptions({
  isColorPickerOpen,
  card,
  isCardNearRightBorder,
  isThinDisplay,
  boundingRect,
  toggleColorPicker,
}: Props) {
  const [isCalendarOpen, setCalendarOpen] = React.useState(false);
  const colorPickerButton = React.useRef<HTMLButtonElement>();

  const changeColor = color => {
    if (card.color !== color) {
      dispatch(changeCardColor)(card._id, color);
    }
    toggleColorPicker();
    if (colorPickerButton.current != null) {
      colorPickerButton.current.focus(); // WAT???
    }
  };

  const handleKeyDown = event => {
    if (event.keyCode === 27) {
      toggleColorPicker();
      if (colorPickerButton.current != null) {
        colorPickerButton.current.focus();
      }
    }
  };

  const handleClickOutside = () => {
    toggleColorPicker();
    if (colorPickerButton.current != null) {
      colorPickerButton.current.focus();
    }
  };

  const toggleCalendar = () => {
    setCalendarOpen(!isCalendarOpen);
  };

  const calendarStyle = {
    content: {
      top: Math.min(boundingRect.bottom + 10, window.innerHeight - 300),
      left: boundingRect.left,
    },
  };

  const calendarMobileStyle = {
    content: {
      top: 110,
      left: "50%",
      transform: "translateX(-50%)",
    },
  };
  return (
    <div
      className="options-list"
      style={{
        alignItems: isCardNearRightBorder ? "flex-end" : "flex-start",
      }}
    >
      <div>
        <button
          onClick={() => dispatch(deleteCard)(card._id)}
          className="options-list-button"
        >
          <div className="modal-icon">
            <FaTrash />
          </div>
          &nbsp;Delete
        </button>
      </div>
      <div className="modal-color-picker-wrapper">
        <button
          className="options-list-button"
          onClick={() => toggleColorPicker()}
          onKeyDown={handleKeyDown}
          ref={colorPickerButton}
          aria-haspopup
          aria-expanded={isColorPickerOpen}
        >
          <img src={colorIcon} alt="colorwheel" className="modal-icon" />
          &nbsp;Color
        </button>
        {isColorPickerOpen && (
          <ClickOutside
            eventTypes="click"
            handleClickOutside={() => handleClickOutside()}
          >
            <div className="modal-color-picker" onKeyDown={handleKeyDown}>
              {["white", "#6df", "#6f6", "#ff6", "#fa4", "#f66"].map(color => (
                <button
                  key={color}
                  style={{ background: color }}
                  className="color-picker-color"
                  onClick={() => changeColor(color)}
                />
              ))}
            </div>
          </ClickOutside>
        )}
      </div>
      <div>
        <button
          onClick={() => toggleCalendar()}
          className="options-list-button"
        >
          <div className="modal-icon">
            <MdAlarm />
          </div>
          &nbsp;Due date
        </button>
      </div>
      <Modal
        isOpen={isCalendarOpen}
        onRequestClose={toggleCalendar}
        overlayClassName="calendar-underlay"
        className="calendar-modal"
        style={isThinDisplay ? calendarMobileStyle : calendarStyle}
      >
        <Calendar
          cardId={card._id}
          date={card.date}
          toggleCalendar={toggleCalendar}
        />
      </Modal>
    </div>
  );
}

export default CardOptions;
