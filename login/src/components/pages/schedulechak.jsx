import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import './Schedule.css';

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const randomColors = [
  '#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8',
  '#6f42c1', '#fd7e14', '#6610f2', '#e83e8c', '#20c997',
];

const colorMap = {};

const getColorForStudent = (referenceNumber) => {
  if (!colorMap[referenceNumber]) {
    const randomIndex = Math.floor(Math.random() * randomColors.length);
    colorMap[referenceNumber] = randomColors[randomIndex];
  }
  return colorMap[referenceNumber];
};

const ScheduleChak = () => {
  const [schedules, setSchedules] = useState({});
  const [expanded, setExpanded] = useState({});
  const [instructors, setInstructors] = useState([]);
  const [calendarView, setCalendarView] = useState(Views.WEEK);
  const [currentDate, setCurrentDate] = useState(new Date());
  const branch = 'chaklala';

  useEffect(() => {
    const loadFromLocalStorage = () => {
      const storedInstructors = localStorage.getItem(`instructors_${branch}`);
      const storedSchedules = localStorage.getItem(`schedules_${branch}`);
      if (storedInstructors && storedSchedules) {
        setInstructors(JSON.parse(storedInstructors));
        setSchedules(JSON.parse(storedSchedules));
      }
    };

    const fetchInstructors = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/instructors/${branch}`);
        const instructorData = response.data;
        const fetchAdmissionsPromises = instructorData.map(async (instructor) => {
          const instructorKey = `${instructor.name} - ${instructor.id} (${instructor.car})`;
          const admissionsResponse = await axios.get(`http://localhost:5000/api/admissions/${branch}/instructor/${instructor.name}`);
          const admissions = admissionsResponse.data;
          const instructorEvents = admissions.flatMap(admission =>
            admission.timeSlots.map(slot => ({
              id: admission._id,
              title: `${admission.firstName} ${admission.fatherName} / ${admission.cellNumber} / ${instructor.car}`,
              start: new Date(slot.start),
              end: new Date(slot.end),
              admissionData: admission,
            }))
          );
          return { instructorKey, events: instructorEvents };
        });

        const admissionsData = await Promise.all(fetchAdmissionsPromises);
        const initialSchedules = {};
        const initialExpandedState = {};
        admissionsData.forEach(({ instructorKey, events }) => {
          initialSchedules[instructorKey] = events;
          initialExpandedState[instructorKey] = true;
        });

        setInstructors(instructorData);
        setSchedules(initialSchedules);
        setExpanded(initialExpandedState);
        
        localStorage.setItem(`instructors_${branch}`, JSON.stringify(instructorData));
        localStorage.setItem(`schedules_${branch}`, JSON.stringify(initialSchedules));
      } catch (error) {
        console.error('Error fetching instructors or admissions:', error);
        loadFromLocalStorage();
      }
    };

    if (navigator.onLine) {
      fetchInstructors();
    } else {
      loadFromLocalStorage();
    }
  }, [branch]);

  const toggleSchedule = (instructorKey) => {
    setExpanded(prev => ({ ...prev, [instructorKey]: !prev[instructorKey] }));
  };

  const moveEvent = ({ event, start, end }) => {
    if (!event || !event.admissionData) {
      console.error("Invalid event or missing admission data.");
      return;
    }

    const instructorKey = `${event.admissionData.instructor} - ${event.admissionData.lecturerCode} (${event.admissionData.vehicle})`;
    const existingEvents = schedules[instructorKey] || [];
    
    const hasOverlap = existingEvents.some((existingEvent) => {
      if (existingEvent.id === event.id) return false;
      return (
        (start >= existingEvent.start && start < existingEvent.end) ||
        (end > existingEvent.start && end <= existingEvent.end) ||
        (start <= existingEvent.start && end >= existingEvent.end)
      );
    });

    if (hasOverlap) {
      alert("The selected date and time are already occupied.");
      return;
    }

    const { admissionData } = event;
    const { admissionId, timeSlots } = admissionData;

    if (!admissionId || !timeSlots) {
      console.error("Admission ID or time slots missing for the event.");
      return;
    }

    const originalFirstStart = new Date(timeSlots[0].start);
    const newFirstStart = start;
    const offset = newFirstStart.getTime() - originalFirstStart.getTime();

    const updatedTimeSlots = timeSlots.map((slot) => {
      const newStart = new Date(new Date(slot.start).getTime() + offset);
      const newEnd = new Date(new Date(slot.end).getTime() + offset);
      return { start: newStart.toISOString(), end: newEnd.toISOString(), title: slot.title };
    });

    saveRescheduledEvents(admissionId, updatedTimeSlots);
  };

  const saveRescheduledEvents = async (admissionId, updatedTimeSlots) => {
    if (navigator.onLine) {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/admissions/${branch}/${admissionId}`,
          { timeSlots: updatedTimeSlots }
        );

        if (response.status === 200) {
          alert("Events rescheduled successfully for this admission.");
          window.location.reload();
        } else {
          console.error("Failed to save events:", response.data);
          alert("Error: Could not save the events.");
        }
      } catch (error) {
        console.error("Error saving events:", error);
        alert("Error: Could not save the events.");
      }
    } else {
      const unsyncedSchedules = JSON.parse(localStorage.getItem(`unsynced_schedules_${branch}`)) || [];
      unsyncedSchedules.push({ admissionId, timeSlots: updatedTimeSlots });
      localStorage.setItem(`unsynced_schedules_${branch}`, JSON.stringify(unsyncedSchedules));

      const updatedSchedules = { ...schedules };
      Object.keys(updatedSchedules).forEach(instructorKey => {
        updatedSchedules[instructorKey] = updatedSchedules[instructorKey].map(event =>
          event.admissionData._id === admissionId ? { ...event, timeSlots: updatedTimeSlots } : event
        );
      });
      setSchedules(updatedSchedules);
      localStorage.setItem(`schedules_${branch}`, JSON.stringify(updatedSchedules));

      alert("Events saved locally and will sync when online.");
    }
  };

  const eventPropGetter = (event) => {
    const backgroundColor = getColorForStudent(event.admissionData.referenceNumber);
    return {
      style: {
        backgroundColor,
        color: '#ffffff', // Set text color to white for better contrast
      },
    };
  };

  const handleNext = () => {
    const newDate = moment(currentDate);
    switch (calendarView) {
      case Views.DAY:
        newDate.add(1, 'days');
        break;
      case Views.WEEK:
        newDate.add(1, 'weeks');
        break;
      case Views.MONTH:
        newDate.add(1, 'months');
        break;
      default:
        break;
    }
    setCurrentDate(newDate.toDate());
  };

  const handleRangeChange = (range) => {
    setCurrentDate(new Date());
};;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="schedule-container">
        <h1>Schedule for {branch.charAt(0).toUpperCase() + branch.slice(1)} Branch</h1>
        
        <div className="view-buttons">
          <button onClick={() => setCalendarView(Views.DAY)}>Day</button>
          <button onClick={() => setCalendarView(Views.WEEK)}>Week</button>
          <button onClick={() => setCalendarView(Views.MONTH)}>Month</button>
        </div>
        
        {instructors.map((instructor, index) => {
          const instructorKey = `${instructor.name} - ${instructor.id} (${instructor.car})`;
          return (
            <div key={index} className="lecturer-schedule">
              <div className="lecturer-header" onClick={() => toggleSchedule(instructorKey)}>
                <h2>{instructorKey}</h2>
                <button className="expand-button">
                  {expanded[instructorKey] ? '▾' : '▸'}
                </button>
              </div>
              {expanded[instructorKey] && (
                <div className="calendar-container">
                  <DragAndDropCalendar
                    localizer={localizer}
                    events={schedules[instructorKey] || []}
                    startAccessor="start"
                    endAccessor="end"
                    view={calendarView}
                    date={new Date()}
                    onRangeChange={handleRangeChange}
                    style={{ height: 400, margin: '20px' }}
                    views={{ day: true, week: true, month: true }}
                    selectable
                    onEventDrop={moveEvent}
                    toolbar={false}
                    eventPropGetter={eventPropGetter}
                  />
                  <button onClick={handleNext} className="next-button">
                    Next
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </DndProvider>
  );
};

export default ScheduleChak;
