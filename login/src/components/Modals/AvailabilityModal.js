import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

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

export default function AvailabilityModal({ open, setOpen, bookedSlots }) {
  const [modalData, setModalData] = useState([]); // State for storing events of a clicked day
  const [openModal, setOpenModal] = useState(false); // State to manage inner modal for day events

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

  const mergedSlots = mergeSlots(bookedSlots);
  const myEventsList = mergedSlots.map((slot) => ({
    title: `Booked ${slot.startTime} to ${slot.endTime}`,
    start: new Date(`${slot.date}T${slot.startTime}`),
    end: new Date(`${slot.date}T${slot.endTime}`),
    color: "red",
    tooltip: `Booked from ${slot.startTime} to ${slot.endTime}`,
  }));

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

  // Function to handle day click
  const handleEventClick = (day) => {
    const eventsForDay = myEventsList.filter(
      (event) =>
        new Date(event.start).toDateString() === new Date(day).toDateString()
    );

    setModalData(eventsForDay);
    setOpenModal(true);
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
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold text-gray-900"
                    >
                      Instructor Availability
                    </DialogTitle>
                    <div className="mt-2">
                      <Calendar
                        localizer={localizer}
                        events={myEventsList}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 400, width: 800 }}
                        eventPropGetter={eventStyleGetter}
                        defaultView="month"
                        components={{
                          toolbar: CustomToolbar,
                        }}
                        selectable // Enables day clicking
                        onSelectSlot={({ start }) => handleEventClick(start)}
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

      {/* Modal for showing events of a specific day */}
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
