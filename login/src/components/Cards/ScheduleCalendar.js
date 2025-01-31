import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DND_Calendar from "../Utils/DND_Calendar";
import { fetchInstructors, fetchSlots } from "store/instructor/action";
import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
export default function ScheduleCalendar({ color = "light", title }) {
  const dispatch = useDispatch();
  const { slots, instructors, isInstructorLoading } = useSelector(
    (state) => state.instructor
  );
  const [events, setEvents] = useState([]);

  const [instructorIdx, setInstructorIdx] = useState(null);

  const { user } = useSelector((state) => state.auth);

  const setEventsHandler = () => {
    const formattedEvents = slots.flatMap((slot) =>
      slot.slots.map((slot, index) => ({
        id: `${instructors[instructorIdx]?._id}-${slot.date.split("T")[0]}-${
          slot.startTime
        }-${index}`, // Unique ID
        _id: slot._id,
        title: `${slot.studentName} - Class ${index + 1} of ${
          slot.totalClasses
        }`,
        start: new Date(`${slot.date.split("T")[0]}T${slot.startTime}:00`),
        end: new Date(`${slot.date.split("T")[0]}T${slot.endTime}:00`),
        studentName: slot.studentName,
        status: slot.status,
        classNumber: index + 1,
        totalClasses: slot.totalClasses,
        instructorId: instructors[instructorIdx]?._id,
        resourceId: instructors[instructorIdx]?._id,
      }))
    );

    // const filteredEvents = formattedEvents.filter((event) => {
    //   if (selectedInstructor && event.instructorId !== selectedInstructor)
    //     return false;
    //   if (
    //     filters.studentName &&
    //     !event.studentName
    //       .toLowerCase()
    //       .includes(filters.studentName.toLowerCase())
    //   )
    //     return false;
    //   if (filters.status !== "all" && event.status !== filters.status)
    //     return false;
    //   if (filters.showAvailableOnly && event.status !== "available")
    //     return false;
    //   return true;
    // });
    setEvents(formattedEvents);

    // Check for alerts
    // const newAlerts = formattedEvents.reduce((acc, event) => {
    //   if (event.status === "missed") {
    //     acc.push({
    //       type: "error",
    //       message: `${event.studentName} missed Class ${event.classNumber} - Needs rescheduling`,
    //     });
    //   } else if (event.status === "pending_reschedule") {
    //     acc.push({
    //       type: "warning",
    //       message: `Rescheduling needed for ${event.studentName}'s Class ${event.classNumber}`,
    //     });
    //   }
    //   return acc;
    // }, []);

    // setAlerts(newAlerts);
  };
  useEffect(() => {
    dispatch(fetchInstructors(user?.branch?._id));
  }, []);
  useEffect(() => {
    if (instructors[instructorIdx]?._id) {
      dispatch(fetchSlots(instructors[instructorIdx]?._id));
    }
  }, [instructorIdx]);
  useEffect(setEventsHandler, [isInstructorLoading]);
  const handleEventsChange = (updatedEvents) => {
    setEvents(updatedEvents);
  };
  console.log(slots);
  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded  px-4 py-3 " +
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        <label
          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
          htmlFor="grid-password"
        >
          Instructor
        </label>
        <select
          value={instructorIdx}
          onChange={(e) => setInstructorIdx(e.target.value)}
          className="border rounded px-3 py-2 w-full my-2"
        >
          <option value={null}>Select Instructor</option>
          {instructors.map((instructor, idx) => (
            <option key={instructor._id} value={idx}>
              {instructor.name}
            </option>
          ))}
        </select>

        <DND_Calendar
          events={events}
          onEventsChange={handleEventsChange}
          title={title}
          instructorIdx={instructorIdx}
          instructors={instructors}
        />
      </div>
    </>
  );
}

ScheduleCalendar.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
  title: PropTypes.string.isRequired,
};
