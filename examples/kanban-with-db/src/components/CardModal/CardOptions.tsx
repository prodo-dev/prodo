import * as React from "react";
import Modal from "react-modal";
//@ts-ignore
import FaTrash from "react-icons/lib/fa/trash";
//@ts-ignore
import MdAlarm from "react-icons/lib/md/access-alarm";
import Calendar from "./Calendar";
import ClickOutside from "../ClickOutside/ClickOutside";
//@ts-ignore
import colorIcon from "../../assets/images/color-icon.png";
import "./CardOptions.scss";
import { Card } from "../../types";
import { dispatch, db } from "../../model";

type Props = {
  isColorPickerOpen: boolean;
  card: Card;
  isCardNearRightBorder: boolean;
  isThinDisplay: boolean;
  boundingRect: { bottom: any; left: any };
  toggleColorPicker: Function;
};

function changeCardColor(id: string, color: string) {
  db.cardsById.update(id, { color });
}

function deleteCard(id: string) {
  db.cardsById.delete(id);
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
  let colorPickerButton: any;

  const changeColor = color => {
    if (card.color !== color) {
      dispatch(changeCardColor)(card.id, color);
    }
    toggleColorPicker();
    colorPickerButton.focus(); // WAT???
  };

  const handleKeyDown = event => {
    if (event.keyCode === 27) {
      toggleColorPicker();
      colorPickerButton.focus();
    }
  };

  const handleClickOutside = () => {
    toggleColorPicker();
    colorPickerButton.focus();
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
          onClick={() => dispatch(deleteCard)(card.id)}
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
          ref={ref => {
            colorPickerButton = ref;
          }}
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
          cardId={card.id}
          date={card.date}
          toggleCalendar={toggleCalendar}
        />
      </Modal>
    </div>
  );
}

export default CardOptions;
