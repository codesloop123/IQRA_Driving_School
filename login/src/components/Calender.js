import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
const localizer = momentLocalizer(moment);

const MyCalendar = ({ myEventsList }) => {
  const eventStyleGetter = (event) => {
    const backgroundColor = event.color;
    return {
      style: {
        backgroundColor,
        color: "white",
        borderRadius: "5px",
        border: "none",
      },
    };
  };
  return (
    <div className="flex">
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 400 }}
        eventPropGetter={eventStyleGetter}
        min={new Date(1970, 1, 1, 6, 0)}   // 6:00 AM
        max={new Date(1970, 1, 1, 23, 0)}  // 11:00 PM
      />
    </div>
  );
};
export default MyCalendar;
