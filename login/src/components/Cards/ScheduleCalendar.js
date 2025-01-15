import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DND_Calendar from "../Utils/DND_Calendar";
import { useSelector, useDispatch } from "react-redux";
import { fetchInstructors } from "store/instructor/action";

function convertBookedSlotsToEvents(bookedSlots) {
  return bookedSlots.map((slot, index) => {
    const baseDate = new Date(slot.date);
    const [startHour, startMinute] = slot.startTime.split(":").map(Number);
    const [endHour, endMinute] = slot.endTime.split(":").map(Number);

    const startDate = new Date(baseDate);
    startDate.setHours(startHour, startMinute, 0, 0);

    const endDate = new Date(baseDate);
    endDate.setHours(endHour, endMinute, 0, 0);

    return {
      id: index + 1,
      title: `Event ${index + 1}`,
      subtitle: `RefNo: ${slot.refNo}`,
      start: startDate,
      end: endDate,
      present:
        slot.status === "Completed"
          ? true
          : slot.status === "Missed"
          ? false
          : null,
    };
  });
}

export default function ScheduleCalendar({ color = "light", title }) {
  const [events, setEvents] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const instructors = useSelector((state) => state.instructor.instructors);

  // Fetch instructors when component mounts
  useEffect(() => {
    dispatch(fetchInstructors());
  }, [dispatch]);

  // Update events when instructors or user changes
  useEffect(() => {
    if (user && instructors.length > 0) {
      // Filter instructors by branch
      const branchInstructors = instructors.filter(
        (instructor) => instructor.branch.name === user.branch.name
      );

      // Get slots from filtered instructors
      const slots = branchInstructors.flatMap(
        (instructor) => instructor.bookedSlots
      );

      // Convert slots to events
      const newEvents = convertBookedSlotsToEvents(slots);
      setEvents(newEvents);
    }
  }, [instructors, user]);

  const handleEventsChange = (updatedEvents) => {
    setEvents(updatedEvents);
  };

  return (
    <>
      <DND_Calendar
        events={events}
        onEventsChange={handleEventsChange}
        title={title}
        color={color}
      />
    </>
  );
}

ScheduleCalendar.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
  title: PropTypes.string.isRequired,
};