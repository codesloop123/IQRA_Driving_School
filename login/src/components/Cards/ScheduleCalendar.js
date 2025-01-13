import React, { useState } from "react";
import PropTypes from "prop-types";
import DND_Calendar from "../Utils/DND_Calendar";

export default function ScheduleCalendar({ color = "light", title }) {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Event 1",
      start: new Date(2025, 0, 1, 10, 0, 0),
      end: new Date(2025, 0, 1, 11, 0, 0),
      present: true,
    },
    {
      id: 5,
      title: "Event 5",
      subtitle: "New Event",
      start: new Date(2025, 0, 14, 11, 0, 0),
      end: new Date(2025, 0, 14, 12, 0, 0),
      present: null,
    },
    {
      id: 6,
      title: "Event 6",
      subtitle: "New Event",
      start: new Date(2025, 0, 14, 12, 0, 0),
      end: new Date(2025, 0, 14, 13, 0, 0),
      present: null,
    },
    {
      id: 7,
      title: "Event 7",
      subtitle: "New Event",
      start: new Date(2025, 0, 14, 13, 0, 0),
      end: new Date(2025, 0, 14, 14, 0, 0),
      present: null,
    },
    // ... other events
  ]);

  const handleEventsChange = (updatedEvents) => {
    setEvents(updatedEvents);
  };

  return (
    <div
      className={
        "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
        (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
      }
    >
      {/* Calendar */}
      <DND_Calendar
        events={events}
        onEventsChange={handleEventsChange}
        title={title}
      />
    </div>
  );
}

ScheduleCalendar.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
  title: PropTypes.string.isRequired,
};
