// import React from "react";

// export default function Example({ open, setOpen }) {
//   return (
//     <>
//       {open && (
//         <>
//           {/* Overlay */}
//           <div
//             className="fixed inset-0 z-40 opacity-5 "
//             onClick={() => setOpen(false)}
//           ></div>

//           {/* Modal */}
//           <div className="fixed inset-0 z-50 flex items-center justify-center">
//             <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg mx-4">
//               {/* Header */}
//               <div className="flex justify-between items-center px-6 py-4 border-b">
//                 <h3 className="text-lg font-semibold">Modal Title</h3>
//                 <button
//                   onClick={() => setOpen(false)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   ×
//                 </button>
//               </div>

//               {/* Body */}
//               <div className="p-6">
//                 <p className="text-gray-600">
//                   I always felt like I could do anything. That’s the main thing
//                   people are controlled by! Thoughts - their perception of
//                   themselves! They're slowed down by their perception of
//                   themselves. If you're taught you can’t do anything, you won’t
//                   do anything. I was taught I could do everything.
//                 </p>
//               </div>

//               {/* Footer */}
//               <div className="flex justify-end px-6 py-4 border-t">
//                 <button
//                   onClick={() => setOpen(false)}
//                   className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
//                 >
//                   Close
//                 </button>
//                 <button
//                   onClick={() => setOpen(false)}
//                   className="ml-2 px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// }

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

export default function Example({ open, setOpen }) {
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
       <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-50" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                  {/* <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-600" /> */}
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-gray-900"
                  >
                    Deactivate account
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to deactivate your account? All of
                      your data will be permanently removed. This action cannot
                      be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                Deactivate
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
