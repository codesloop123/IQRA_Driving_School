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
    <div className="rbc-toolbar flex justify-between items-center">
      <span className="text-md font-bold">{toolbar.label}</span>
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
    </div>
  );
};

export default function AvailabilityModal({ open, setOpen, bookedSlots }) {
  // Function to merge booked slots
  function mergeSlots(slots) {
    // Clone the array to ensure we are working on a new instance
    const clonedSlots = slots.map((slot) => ({ ...slot }));

    // Sort the cloned array by date and start time
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
        // Merge contiguous slots
        currentSlot = { ...currentSlot, endTime: nextSlot.endTime }; // Clone currentSlot before mutation
      } else {
        // Push the current slot to the merged array
        mergedSlots.push(currentSlot);
        currentSlot = nextSlot;
      }
    }

    // Push the last slot
    mergedSlots.push(currentSlot);

    return mergedSlots;
  }
  // Step 3: Convert merged slots to calendar events
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
  console.log(myEventsList, "myEventsList");
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-50" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
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
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                className="mt-3 bg-red-500 text-white inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-auto"
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
