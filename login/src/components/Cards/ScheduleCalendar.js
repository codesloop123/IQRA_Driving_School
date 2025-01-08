import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { fetchInstructors } from "store/instructor/action";
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function ScheduleCalendar({ color, title }) {
  const dispatch = useDispatch();
  const { instructors, loading } = useSelector((state) => state.instructor);
  const { user } = useSelector((state) => state.auth);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    dispatch(fetchInstructors());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && instructors.length > 0) {
      const formattedEvents = instructors.flatMap((instructor) =>
        instructor.bookedSlots.map((slot) => ({
          title: instructor.name, // Replace name with your instructor's field
          start: new Date(`${slot.date}T${slot.startTime}:00`),
          end: new Date(`${slot.date}T${slot.endTime}:00`),
        }))
      );
      setEvents(formattedEvents);
    }
  }, [loading, instructors]);

  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        <div className="rounded-t mb-0 py-3 px-2 border-0">
          <div className="flex flex-wrap justify-between items-center">
            <div className="relative w-full pl-4 max-w-full flex-grow flex-1">
              <h3
                className={
                  "font-semibold text-lg " +
                  (color === "light" ? "text-blueGray-700" : "text-white")
                }
              >
                {title}
              </h3>
            </div>
          </div>
        </div>
        <div style={{ height: "80vh" }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
          />
        </div>
      </div>
    </>
  );
}

ScheduleCalendar.defaultProps = {
  color: "light",
};

ScheduleCalendar.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
