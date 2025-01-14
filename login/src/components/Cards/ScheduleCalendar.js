import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DND_Calendar from "../Utils/DND_Calendar";
import { useSelector,useDispatch } from 'react-redux';
import { fetchInstructors } from "store/instructor/action";
const GetInstructorsByBranch = (user) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchInstructors());
  }, [dispatch]);
  const instructors = useSelector((state) => state.instructor.instructors);
  const result = instructors.filter((instructor) => instructor.branch.name === user.branch.name);
  return result;
};

const GetSlotsData = (instructors) =>{
  const slots = instructors.flatMap((instructor) => instructor.bookedSlots);
  return slots;
};

function convertBookedSlotsToEvents(bookedSlots) {
  return bookedSlots.map((slot, index) => {
    // Parse ISO date
    const baseDate = new Date(slot.date); // ISO date format is handled by JS Date
    const [startHour, startMinute] = slot.startTime.split(':').map(Number);
    const [endHour, endMinute] = slot.endTime.split(':').map(Number);

    // Construct start and end dates
    const startDate = new Date(baseDate);
    startDate.setHours(startHour, startMinute, 0, 0);

    const endDate = new Date(baseDate);
    endDate.setHours(endHour, endMinute, 0, 0);

    // Return the formatted event object
    return {
      id: index + 1, // Unique ID
      title: `Event ${index + 1}`,
      subtitle: `RefNo: ${slot.refNo}`,
      start: startDate,
      end: endDate,
      present: slot.status === "Completed" ? true : slot.status === "Missed" ? false : null,
    };
  });
}
function getSlots(user){
  // get the instructors of the user's branch
  const instructors = GetInstructorsByBranch(user);
  // get the booked slots of these instructors
  const slotsData = GetSlotsData(instructors);
  // console.log(slotsData);
  // convert the booked slots to events format
  const events = convertBookedSlotsToEvents(slotsData);
  return events;
}

export default function ScheduleCalendar({ color = "light", title }) {
  const [events, setEvents] = useState([]);

  // Get the user's id (currently logged in)
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      // Get the instructors of the user's branch and slots
      const slotsData = getSlots(user);
      // Convert slots to events and update state
      setEvents(slotsData);
    }
  }, [user]); // Runs whenever 'user' changes

  const handleEventsChange = (updatedEvents) => {
    setEvents(updatedEvents);
  };

  return (
    <>
      {/* Calendar */}
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
