import * as React from "react";
// @ts-ignore
import format from "date-fns/format";
// @ts-ignore
import differenceInCalendarDays from "date-fns/difference_in_calendar_days";
// @ts-ignore
import MdAlarm from "react-icons/lib/md/access-alarm";
// @ts-ignore
import MdDoneAll from "react-icons/lib/fa/check-square-o";
import "./CardBadges.scss";

type Props = {
  date: Date;
  checkboxes: {
    total: number;
    checked: number;
  };
};

function DueDate({ date }: Partial<Props>) {
  if (!date) {
    return null;
  }
  const dueDateFromToday = differenceInCalendarDays(date, new Date());

  let dueDateString: string;
  if (dueDateFromToday < -1) {
    dueDateString = `${Math.abs(dueDateFromToday)} days ago`;
  } else if (dueDateFromToday === -1) {
    dueDateString = "Yesterday";
  } else if (dueDateFromToday === 0) {
    dueDateString = "Today";
  } else if (dueDateFromToday === 1) {
    dueDateString = "Tomorrow";
  } else {
    dueDateString = format(date, "D MMM");
  }

  let dueDateColor: string;
  if (dueDateFromToday < 0) {
    dueDateColor = "red";
  } else if (dueDateFromToday === 0) {
    dueDateColor = "#d60";
  } else {
    dueDateColor = "green";
  }

  return (
    <div className="badge" style={{ background: dueDateColor }}>
      <MdAlarm className="badge-icon" />
      &nbsp;
      {dueDateString}
    </div>
  );
}

function TaskProgress({ checkboxes }: Partial<Props>) {
  const { total, checked } = checkboxes;
  if (total === 0) {
    return null;
  }
  return (
    <div
      className="badge"
      style={{ background: checked === total ? "green" : "#444" }}
    >
      <MdDoneAll className="badge-icon" />
      &nbsp;
      {checked}/{total}
    </div>
  );
}

const CardBadges = ({ date, checkboxes }: Props) => (
  <div className="card-badges">
    <DueDate date={date} />
    <TaskProgress checkboxes={checkboxes} />
  </div>
);

export default CardBadges;
