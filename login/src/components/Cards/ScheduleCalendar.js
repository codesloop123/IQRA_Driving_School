import React, { useState } from "react";
import PropTypes from "prop-types";
import DND_Calendar from "../Utils/DND_Calendar";

export default function ScheduleCalendar({ color = "light", title }) {
  const dispatch = useDispatch();
  const { instructors, loading } = useSelector((state) => state.instructor);
  const [events, setEvents] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [dateRange, setDateRange] = useState({
    start: moment().format("YYYY-MM-DD"),
    end: moment().add(6, "days").format("YYYY-MM-DD"),
  });
  const [filters, setFilters] = useState({
    status: "all",
    studentName: "",
    showAvailableOnly: false,
  });
  const [alerts, setAlerts] = useState([]);
  const { users } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!loading && instructors.length > 0) {
      const formattedEvents = instructors.flatMap((instructor) =>
        instructor.bookedSlots.map((slot, index) => ({
          id: `${instructor._id}-${slot.date}-${slot.startTime}-${index}`, // Unique ID
          title: `${slot.studentName} - Class ${slot.classNumber} of ${slot.totalClasses}`,
          start: new Date(`${slot.date}T${slot.startTime}:00`),
          end: new Date(`${slot.date}T${slot.endTime}:00`),
          studentName: slot.studentName,
          status: slot.status,
          classNumber: slot.classNumber,
          totalClasses: slot.totalClasses,
          instructorId: instructor._id,
          resourceId: instructor._id,
        }))
      );

      const filteredEvents = formattedEvents.filter((event) => {
        if (selectedInstructor && event.instructorId !== selectedInstructor)
          return false;
        if (
          filters.studentName &&
          !event.studentName
            .toLowerCase()
            .includes(filters.studentName.toLowerCase())
        )
          return false;
        if (filters.status !== "all" && event.status !== filters.status)
          return false;
        if (filters.showAvailableOnly && event.status !== "available")
          return false;
        return true;
      });

      setEvents(filteredEvents);

      // Check for alerts
      const newAlerts = formattedEvents.reduce((acc, event) => {
        if (event.status === "missed") {
          acc.push({
            type: "error",
            message: `${event.studentName} missed Class ${event.classNumber} - Needs rescheduling`,
          });
        } else if (event.status === "pending_reschedule") {
          acc.push({
            type: "warning",
            message: `Rescheduling needed for ${event.studentName}'s Class ${event.classNumber}`,
          });
        }
        return acc;
      }, []);
      setAlerts(newAlerts);
    } else {
      console.log(users);
      dispatch(fetchInstructors(users.branch._id));
    }
  }, [dispatch, loading, instructors, selectedInstructor, filters, dateRange]);

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
      />
    </>
  );
}

ScheduleCalendar.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
  title: PropTypes.string.isRequired,
};
