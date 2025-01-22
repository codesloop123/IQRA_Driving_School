import React, { useState } from "react";
import moment from "moment";
import { momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateSlots, fetchSlots } from "store/instructor/action";
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

export default function ScheduleCalendar({
  events,
  onEventsChange,
  instructors,
  instructorIdx,
  color = "light",
  title = "Scheduler",
}) {
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const dispatch = useDispatch();
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleSelectEvent = (event) => {
    const currentTime = new Date().getTime();
    const isDoubleClick = currentTime - lastClickTime < 300;
    setLastClickTime(currentTime);

    if (isDoubleClick) {
      setSelectedEvents([]);
      return;
    }

    const modifierKeyPressed =
      window.event?.ctrlKey || window.event?.metaKey;  // meta key is command key for mac and windows key for windows

    setSelectedEvents((prev) => {
      if (modifierKeyPressed) {
        const isSelected = prev.some((e) => e.id === event.id);
        return isSelected
          ? prev.filter((e) => e.id !== event.id)
          : [...prev, event];
      }

      return prev.length === 1 && prev[0].id === event.id ? [] : [event];
    });
  };

  const handleSelectSlot = (slotInfo) => {
    const clickedDate = moment(slotInfo.start).startOf("day");
    if (selectedDate) {
      moveEventsToDate(selectedDate, clickedDate);
      setSelectedDate(null);
    } else {
      setSelectedDate(clickedDate);
    }
  };

  const moveEventsToDate = (sourceDate, targetDate) => {
    const now = moment().startOf("day");
    sourceDate = moment(sourceDate).startOf("day");
    targetDate = moment(targetDate).startOf("day");

    const eventsOnSourceDate = events.filter((event) =>
      moment(event.start).startOf("day").isSame(sourceDate)
    );

    if (eventsOnSourceDate.length === 0) {
      toast.error("No events found on the selected date.");
      return;
    }

    if (targetDate.isBefore(now)) {
      toast.error("Cannot move events to past dates.");
      return;
    }

    if (eventsOnSourceDate.some((event) => event.status === "Completed")) {
      toast.error("Cannot move completed events.");
      return;
    }

    const dateDiff = targetDate.diff(sourceDate);

    const proposedMoves = eventsOnSourceDate.map((event) => ({
      ...event,
      start: new Date(event.start.getTime() + dateDiff),
      end: new Date(event.end.getTime() + dateDiff),
    }));

    const sourceEventIds = eventsOnSourceDate.map((e) => e.id);
    const hasOverlaps = proposedMoves.some((proposedEvent) =>
      events.some(
        (existingEvent) =>
          !sourceEventIds.includes(existingEvent.id) &&
          moment(existingEvent.start).startOf("day").isSame(targetDate) &&
          isOverlapping(proposedEvent, existingEvent)
      )
    );

    if (hasOverlaps) {
      toast.error(
        "Cannot move events - there would be time conflicts on the target date."
      );
      return;
    }

    const slots = proposedMoves.map((move) => {
      const date = move?.start.toISOString().split("T")[0];
      const startTime = new Date(move?.start)
        .toTimeString()
        .split(" ")[0]
        .slice(0, 5);
      const endTime = new Date(move?.end)
        .toTimeString()
        .split(" ")[0]
        .slice(0, 5);
      return {
        _id: move?._id,
        startTime,
        endTime,
        date: new Date(date).toISOString(),
      };
    });

    // Dispatch to Redux/backend
    dispatch(updateSlots(slots)).then(() => {
      dispatch(fetchSlots(instructors[instructorIdx]?._id));
    });

    const updatedEvents = events.map((event) => {
      const moveEvent = proposedMoves.find((move) => move.id === event.id);
      return moveEvent || event;
    });

    onEventsChange(updatedEvents);
  };

  const isOverlapping = (event1, event2) => {
    return (
      event1.id !== event2.id &&
      ((event1.start >= event2.start && event1.start < event2.end) ||
        (event1.end > event2.start && event1.end <= event2.end) ||
        (event1.start <= event2.start && event1.end >= event2.end))
    );
  };

  const hasOverlap = (newEvent, excludeEventIds = []) => {
    return events.some(
      (existingEvent) =>
        !excludeEventIds.includes(existingEvent.id) &&
        isOverlapping(newEvent, existingEvent)
    );
  };

  const moveEvent = ({ event, start, end }) => {
    const now = moment().startOf("day");
    const targetDate = moment(start).startOf("day");
    const eventsToMove =
      selectedEvents.length > 0 && selectedEvents.includes(event)
        ? selectedEvents
        : [event];
    if (targetDate.isBefore(now)) {
      toast.error("Cannot move events to past dates.");
      return;
    }

    if (eventsToMove.some((evt) => evt.status === "Completed")) {
      toast.error("Cannot move completed events.");
      return;
    }

    const timeDiff = start.getTime() - event.start.getTime();

    const proposedMoves = eventsToMove.map((evt) => {
      const eventDuration = evt.end.getTime() - evt.start.getTime();
      const newStart = new Date(evt.start.getTime() + timeDiff);
      const newEnd = new Date(newStart.getTime() + eventDuration);

      return {
        ...evt,
        start: newStart,
        end: newEnd,
      };
    });

    const selectedEventIds = eventsToMove.map((evt) => evt.id);
    const hasOverlaps = proposedMoves.some((proposedEvent) =>
      hasOverlap(proposedEvent, selectedEventIds)
    );

    if (hasOverlaps) {
      toast.error(
        "Cannot move events to these time slots - overlapping with existing events."
      );
      return;
    }
    const slots = proposedMoves.map((move) => {
      const date = move?.start.toISOString().split("T")[0];

      const startTime = new Date(move?.start)
        .toTimeString()
        .split(" ")[0]
        .slice(0, 5);
      const endTime = new Date(move?.end)
        .toTimeString()
        .split(" ")[0]
        .slice(0, 5);
      return {
        _id: move?._id,
        startTime,
        endTime,
        date: new Date(date).toISOString(),
      };
    });
    dispatch(updateSlots(slots)).then(() => {
      dispatch(fetchSlots(instructors[instructorIdx]?._id));
    });
    const updatedEvents = events.map((existingEvent) => {
      const matchingMove = proposedMoves.find(
        (move) => move.id === existingEvent.id
      );
      return matchingMove || existingEvent;
    });

    onEventsChange(updatedEvents);
  };

  const getEventStatus = (event) => {
    let color;

    if (event.status === "Completed") color = "#34c759";
    else if (event.status === "Missed") color = "#ff3b30";
    else if (event.status === "Pending") color = "#007aff";
    return color;
  };

  const eventStyleGetter = (event) => {
    const backgroundColor = getEventStatus(event);
    const isSelected = selectedEvents.includes(event);

    return {
      style: {
        backgroundColor: backgroundColor,
        color: isSelected ? "black" : "white",
        borderRadius: "8px",
        border: isSelected ? "2px solid #666" : "1px solid #ddd",
        padding: "5px",
        display: "flex",
        alignItems: "center",
        cursor: event.status === "Completed" ? "not-allowed" : "pointer",
      },
    };
  };

  return (
    <>
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center justify-between w-full">
          <div className="relative w-full max-w-full flex-grow flex-1">
            <h3
              className={
                "font-semibold text-lg" +
                (color === "light" ? "text-blueGray-700" : "text-white")
              }
            >
              {title}
            </h3>
          </div>
          {selectedDate && (
            <div className="text-sm text-blue-500">
              Click another date to move events from{" "}
              {selectedDate.format("MMM DD, YYYY")}
            </div>
          )}
        </div>
      </div>
      <div className="px-4 pb-4" style={{ height: "80vh" }}>
        <DnDCalendar
          localizer={localizer}
          views={["month", "week", "day"]}
          events={events}
          startAccessor="start"
          endAccessor="end"
          step={30}
          timeslots={1}
          min={new Date(2024, 0, 1, 9, 0, 0)}
          max={new Date(2024, 0, 1, 17, 0, 0)}
          defaultView="month"
          defaultDate={new Date()}
          selectable
          resizable
          onEventDrop={moveEvent}
          onEventResize={moveEvent}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          eventLimit={2}
          popup={true}
          components={{
            event: (props) => (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectEvent(props.event);
                }}
              >
                {props.title}
              </div>
            ),
          }}
        />
      </div>
    </>
  );
}
