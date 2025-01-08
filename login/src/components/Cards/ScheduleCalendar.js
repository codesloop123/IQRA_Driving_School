import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { fetchInstructors } from 'store/instructor/action';
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function ScheduleCalendar({ color, title }) {
  const dispatch = useDispatch();
  const { instructors, loading } = useSelector((state) => state.instructor);
  const [events, setEvents] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [dateRange, setDateRange] = useState({
    start: moment().format('YYYY-MM-DD'),
    end: moment().add(6, 'days').format('YYYY-MM-DD'),
  });
  const [filters, setFilters] = useState({
    status: 'all',
    studentName: '',
    showAvailableOnly: false,
  });
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!loading && instructors.length > 0) {
      const formattedEvents = instructors.flatMap((instructor) =>
        instructor.bookedSlots.map((slot) => ({
          id: `${instructor._id}-${slot.date}-${slot.startTime}`, // Unique ID
          title: `${instructor.name} - ${slot.startTime} to ${slot.endTime}`,
          start: new Date(`${slot.date}T${slot.startTime}:00`),
          end: new Date(`${slot.date}T${slot.endTime}:00`),
          instructorName: instructor.name,
          instructorId: instructor._id,
          branchName: instructor.branch?.name || 'N/A', // Optional branch name
          status: slot.status || 'booked', // Default status if not provided
        }))
      );

      const filteredEvents = formattedEvents.filter((event) => {
        const rangeStart = new Date(dateRange.start);
        const rangeEnd = new Date(dateRange.end);

        if (selectedInstructor && event.instructorId !== selectedInstructor) return false;
        if (filters.studentName && !event.instructorName.toLowerCase().includes(filters.studentName.trim().toLowerCase())) return false;
        if (filters.status !== 'all' && event.status !== filters.status) return false;
        if (filters.showAvailableOnly && event.status !== 'available') return false;
        if (event.start < rangeStart || event.start > rangeEnd) return false;

        return true;
      });

      setEvents(filteredEvents);

      // Check for alerts
      const newAlerts = formattedEvents.reduce((acc, event) => {
        if (event.status === 'missed') {
          acc.push({
            type: 'error',
            message: `${event.instructorName} missed a slot on ${event.start.toLocaleDateString()}`,
          });
        } else if (event.status === 'pending_reschedule') {
          acc.push({
            type: 'warning',
            message: `Rescheduling needed for ${event.instructorName}'s slot on ${event.start.toLocaleDateString()}`,
          });
        }
        return acc;
      }, []);
      setAlerts(newAlerts);
    } else {
      dispatch(fetchInstructors());
    }
  }, [dispatch, loading, instructors, selectedInstructor, filters, dateRange]);

  const handleEventDrop = ({ event, start, end }) => {
    const updatedEvents = events.map((ev) =>
      ev.id === event.id ? { ...ev, start, end } : ev
    );
    setEvents(updatedEvents);
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad'; // Default color
    switch (event.status) {
      case 'completed':
        backgroundColor = '#10B981'; // Green
        break;
      case 'missed':
        backgroundColor = '#EF4444'; // Red
        break;
      case 'pending_reschedule':
        backgroundColor = '#F59E0B'; // Yellow
        break;
      default:
        break;
    }
    return { style: { backgroundColor } };
  };

  return (
    <div className={
      "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
      (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
    }>
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full flex-grow flex-1">
            <h3 className={
              "font-semibold text-lg " +
              (color === "light" ? "text-blueGray-700" : "text-white")
            }>
              {title}
            </h3>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-4">
          <select
            value={selectedInstructor}
            onChange={(e) => setSelectedInstructor(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Select Instructor</option>
            {instructors.map((instructor) => (
              <option key={instructor._id} value={instructor._id}>
                {instructor.name}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="missed">Missed</option>
            <option value="pending_reschedule">Pending Reschedule</option>
          </select>

          <input
            type="text"
            placeholder="Search by Student Name"
            value={filters.studentName}
            onChange={(e) => setFilters({ ...filters, studentName: e.target.value })}
            className="border rounded px-3 py-2 w-full"
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={filters.showAvailableOnly}
              onChange={(e) => setFilters({ ...filters, showAvailableOnly: e.target.checked })}
              className="mr-2"
            />
            <span>Show Available Only</span>
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-4 rounded mb-2 ${
                alert.type === 'error' 
                  ? 'bg-red-100 text-red-700 border border-red-400'
                  : 'bg-yellow-100 text-yellow-700 border border-yellow-400'
              }`}
            >
              {alert.message}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="px-4 pb-4" style={{ height: '80vh' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onEventDrop={handleEventDrop}
          eventPropGetter={eventStyleGetter}
          step={30}
          timeslots={1}
          min={new Date(2024, 0, 1, 9, 0, 0)}
          max={new Date(2024, 0, 1, 17, 0, 0)}
          views={['week', 'day']}
          defaultView="week"
          selectable
          resizable
        />
      </div>
    </div>
  );
}

ScheduleCalendar.defaultProps = {
  color: "light",
};

ScheduleCalendar.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
  title: PropTypes.string.isRequired,
};
