import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { fetchInstructors } from "store/instructor/action";
import { toast } from "react-toastify";

const localizer = momentLocalizer(moment);

const CustomToolbar = (toolbar) => {
  return (
    <div className="rbc-toolbar ">
      <span className="rbc-btn-group space-x-2">
        <button
          type="button"
          className="text-white px-3 py-1 rounded"
          onClick={() => toolbar.onNavigate("PREV")}
        >
          Previous
        </button>
        <button
          type="button"
          className=" text-white px-3 py-1 rounded"
          onClick={() => toolbar.onNavigate("NEXT")}
        >
          Next
        </button>
      </span>
      <span className="text-md font-bold rbc-toolbar-label">
        {toolbar.label}
      </span>
      <span className="rbc-btn-group">
        <button
          type="button"
          onClick={() => toolbar.onView("month")}
          className={toolbar.view === "month" ? "active" : ""}
        >
          Month
        </button>
        <button
          type="button"
          onClick={() => toolbar.onView("week")}
          className={toolbar.view === "week" ? "active" : ""}
        >
          Week
        </button>
      </span>
    </div>
  );
};

export default function AvailabilityModal({
  open,
  setOpen,
  courseduration,
  courseTimeDuration,
  changeStartDateTime,
  changeInstructor,
  name,
  area,
  phone,
  car,
}) {
  const [modalData, setModalData] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const dispatch = useDispatch();
  const { instructors, isInstructorLoading } = useSelector(
    (state) => state.instructor
  );
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  useEffect(() => {
    dispatch(fetchInstructors());
  }, [dispatch]);

  const [highlightedEvents, setHighlightedEvents] = useState([]);
  const [newEvents, setNewEvents] = useState([]);

  const stableChangeInstructor = useCallback(changeInstructor, [
    changeInstructor,
  ]);

  // useEffect(() => {
  //   if (selectedInstructor && typeof stableChangeInstructor === "function") {
  //     stableChangeInstructor(selectedInstructor);
  //   }
  // }, [selectedInstructor, stableChangeInstructor]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "instructor") {
      const selectedInstructor_1 = instructors.find(
        (inst) => inst._id === value
      );

      if (!selectedInstructor_1) {
        console.error("Instructor not found!");
        return;
      }
      setSelectedInstructor(selectedInstructor_1);
      stableChangeInstructor(selectedInstructor_1);
      console.log(selectedInstructor);

      const filteredSlots = selectedInstructor_1.bookedSlots || [];
      if (filteredSlots.length > 0) {
        const mergedSlots = mergeSlots(filteredSlots);

        const newEventsList = mergedSlots.map((slot) => ({
          title: `Booked ${slot.startTime} to ${slot.endTime}`,
          start: new Date(`${slot.date}T${slot.startTime}`),
          end: new Date(`${slot.date}T${slot.endTime}`),
          color: generateRandomColor(),
          tooltip: `Booked from ${slot.startTime} to ${slot.endTime}`,
        }));

        setHighlightedEvents(newEventsList);
      } else {
        setHighlightedEvents([]);
      }
      setNewEvents([]);
    } else {
      console.error("Unhandled change for:", name);
    }
  };

  const handleSelectSlot = ({ start }) => {
    if (!start) {
      console.error("Invalid start time received from slot selection.");
      return;
    }
    const startDateTime = new Date(start);
    const positionInWeek = startDateTime.getDay();
    if (positionInWeek === 0) {
      toast.error("Instructors are not available on Sundays");
      return;
    }
    const rangeEvents = [];
    let x = courseTimeDuration / 15;
    let y = courseduration + Math.floor((positionInWeek + courseduration) / 7);
    console.log(y);
    for (let verticalOffset = 0; verticalOffset < x; verticalOffset++) {
      for (let horizontalOffset = 0; horizontalOffset < y; horizontalOffset++) {
        const eventStart = new Date(startDateTime);
        const eventEnd = new Date(startDateTime);

        eventStart.setMinutes(startDateTime.getMinutes() + verticalOffset * 15);
        eventEnd.setMinutes(eventStart.getMinutes() + 15);
        console.log(verticalOffset, x);
        let adjustedDate = startDateTime.getDate() + horizontalOffset;
        eventStart.setDate(adjustedDate);
        eventEnd.setDate(adjustedDate);

        console.log(eventStart);
        if (eventStart.getDay() === 0) {
          continue;
        }

        let myEventsList = highlightedEvents;
        if (myEventsList.length > 0) {
          const clash = myEventsList.some(
            (existingEvent) =>
              (eventStart >= existingEvent.start &&
                eventStart < existingEvent.end) ||
              (eventEnd > existingEvent.start && eventEnd <= existingEvent.end)
          );

          if (clash) {
            toast.error("Instructor is already booked at this time.");
            return;
          }
        }

        rangeEvents.push({
          title: `Booked ${eventStart.toLocaleString()} - ${eventEnd.toLocaleString()}`,
          start: eventStart,
          end: eventEnd,
          color: "#FFD700",
          tooltip: `Booked: ${eventStart.toLocaleTimeString()} - ${eventEnd.toLocaleTimeString()}`,
        });
      }
    }

    setNewEvents(rangeEvents);
    const selectedDate = new Date(rangeEvents[0].start);
    changeStartDateTime(selectedDate, rangeEvents[0].end);
  };

  function mergeSlots(slots) {
    const clonedSlots = slots.map((slot) => ({ ...slot }));
    const sortedSlots = clonedSlots.sort((a, b) => {
      if (a.date === b.date) {
        return a.startTime.localeCompare(b.startTime);
      }
      return a.date.localeCompare(b.date);
    });

    const mergedSlots = [];
    let currentSlot = sortedSlots[0];

    for (let i = 1; i < sortedSlots.length; i++) {
      const nextSlot = sortedSlots[i];
      if (
        currentSlot.date === nextSlot.date &&
        currentSlot.endTime === nextSlot.startTime
      ) {
        currentSlot = { ...currentSlot, endTime: nextSlot.endTime };
      } else {
        mergedSlots.push(currentSlot);
        currentSlot = nextSlot;
      }
    }

    mergedSlots.push(currentSlot);

    return mergedSlots;
  }

  function generateRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

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
    <>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:scale-100">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start justify-center">
                  <div className="mt-1 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold text-center mb-8 text-gray-900"
                    >
                      Instructor Availability
                    </DialogTitle>

                    <div className="w-full lg:w-full px-4 flex flex-row justify-between">
                      <div className="relative mb-3" style={{ width: "33%" }}>
                        <div className="flex justify-between gap-2">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="instructor-select"
                          >
                            Instructor
                          </label>
                        </div>
                        <select
                          required
                          id="instructor-select"
                          name="instructor"
                          value={selectedInstructor?._id || ""}
                          onChange={handleChange}
                          className="border-0 px-3 w-full py-3 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none  ease-linear transition-all duration-150"
                        >
                          <option value="" disabled>
                            Select Instructor
                          </option>
                          {instructors?.map((instructor) => (
                            <option key={instructor?.id} value={instructor._id}>
                              {instructor?.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="relative  mb-3">
                        <h4 className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                          Details
                        </h4>
                        <p className="block uppercase text-xs  mb-1">
                          Name: {name}
                        </p>
                        <p className="block uppercase text-xs  mb-1">
                          Phone Num: {phone}
                        </p>

                        <p className="block uppercase text-xs  mb-1">
                          Area: {area}
                        </p>
                        <p className="block uppercase text-xs  mb-1">
                          Car: {car}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2">
                      <Calendar
                        localizer={localizer}
                        events={[...highlightedEvents, ...newEvents]}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 400, width: 800 }}
                        eventPropGetter={eventStyleGetter}
                        defaultView="week"
                        components={{
                          toolbar: CustomToolbar,
                        }}
                        selectable
                        onSelectSlot={handleSelectSlot}
                        step={15}
                        timeslots={1}
                        min={new Date(1970, 1, 1, 9, 0, 0)}
                        max={new Date(1970, 1, 1, 18, 0, 0)}
                        formats={{
                          timeGutterFormat: "h:mm a",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-3 bg-red-500 text-white inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:mt-0 sm:w-auto"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      {openModal && (
        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          className="relative z-10"
        >
          <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-50" />
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <DialogPanel className="bg-white rounded shadow-lg p-4 max-w-md">
                <DialogTitle className="text-lg font-bold">
                  Events for Selected Day
                </DialogTitle>
                <div className="mt-4">
                  {modalData.length > 0 ? (
                    modalData.map((event, index) => (
                      <div
                        key={index}
                        className="p-2 border rounded my-2 bg-gray-100"
                      >
                        <p>{event.title}</p>
                        <p>
                          Start: {event.start.toLocaleTimeString()} | End:{" "}
                          {event.end.toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>No events for this day</p>
                  )}
                </div>
                <div className="flex justify-end items-center">
                  <button
                    onClick={() => setOpenModal(false)}
                    className="mt-3 bg-red-500 text-white inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:mt-0 sm:w-auto"
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}
