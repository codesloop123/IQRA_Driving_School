// import { useState } from "react";
// import {
//   Dialog,
//   DialogBackdrop,
//   DialogPanel,
//   DialogTitle,
// } from "@headlessui/react";
// // import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

// export default function Example({ open, setOpen }) {
//   return (
//     <Dialog open={open} onClose={setOpen} className="relative z-10">
//       <DialogBackdrop
//         transition
//         className="bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
//       />

//       <div className="absolute top-0 left-1/2 right-1/2  z-10 w-screen overflow-y-auto">
//         <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
//           <DialogPanel
//             transition
//             className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
//           >
//             <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
//               <div className="sm:flex sm:items-start">
//                 {/* <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
//                   <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-600" />
//                 </div> */}
//                 <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
//                   <DialogTitle
//                     as="h3"
//                     className="text-base font-semibold text-gray-900"
//                   >
//                     Deactivate account
//                   </DialogTitle>
//                   <div className="mt-2">
//                     <p className="text-sm text-gray-500">
//                       Are you sure you want to deactivate your account? All of
//                       your data will be permanently removed. This action cannot
//                       be undone.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
//               <button
//                 type="button"
//                 onClick={() => setOpen(false)}
//                 className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
//               >
//                 Deactivate
//               </button>
//               <button
//                 type="button"
//                 data-autofocus
//                 onClick={() => setOpen(false)}
//                 className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
//               >
//                 Cancel
//               </button>
//             </div>
//           </DialogPanel>
//         </div>
//       </div>
//     </Dialog>
//   );
// }
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

export default function Example({ open, setOpen }) {
  return (
    <Dialog open={open} onClose={setOpen} className="absolute z-50">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative w-full max-w-lg rounded-lg bg-white shadow-xl">
          <div className="px-4 py-5 sm:p-6">
            <DialogTitle
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              Deactivate account
            </DialogTitle>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you sure you want to deactivate your account? All of your
                data will be permanently removed. This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => setOpen(false)}
            >
              Deactivate
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
