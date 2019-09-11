import * as React from "react";
import DayPicker from "react-day-picker";
import "./ReactDayPicker.css";
import { dispatch, state } from "../../model";

type Props = {
  cardId: string;
  date?: string | Date;
  toggleCalendar: Function;
};

function changeCardDate(date: Date, cardId: string) {
  state.cardsById[cardId].date = date;
}

function Calendar({ cardId, date, toggleCalendar }: Props) {
  const [selectedDay, selectDay] = React.useState(
    date ? new Date(date) : undefined
  );
  return (
    <div className="calendar">
      <DayPicker
        onDayClick={(day, { selected, disabled }) => {
          if (disabled) return;
          selectDay(selected ? undefined : day);
        }}
        selectedDays={selectedDay}
        disabledDays={{ before: new Date() }}
      />
      <div className="calendar-buttons">
        <button
          onClick={() => {
            dispatch(changeCardDate)(selectedDay, cardId);
            toggleCalendar();
          }}
          className="calendar-save-button"
        >
          Save
        </button>
        <button onClick={() => toggleCalendar()}>Cancel</button>
      </div>
    </div>
  );
}

export default Calendar;
