import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import admissionFormPdf from "../../assets/pdf/admissionForm.pdf";
import { saveAs } from "file-saver";

const PDFModal = ({ formData, refNo, open, setOpen }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  const closeModal = () => {
    setOpen(false);
    setPreviewUrl(null); // Reset preview
  };

  async function generatePDF() {
    try {
      // Load the existing PDF file from the public folder
      const response = await fetch(admissionFormPdf);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF. Status: ${response.status}`);
      }
      const existingPdfBytes = await response.arrayBuffer(); // Read the file as an ArrayBuffer

      // Load the PDFDocument
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // Get the first page of the PDF
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      const name = formData?.firstName + " " + formData?.lastName;
      const education = "--"; // No field for education
      const currentTime = new Date();
      const drivingdays = formData?.courseduration - 2;
      const learningdays = formData?.courseduration - drivingdays;
      const time = `${currentTime.getHours()}:${currentTime.getMinutes()}`;
      const date = `${currentTime.getDate().toString().padStart(2, "0")}-${(
        currentTime.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${currentTime.getFullYear()}`;
      console.log(formData);
      // Define the data and positions
      const data = {
        refNo: { x: 80, y: 654, value: refNo.toString() },
        "D/o,W/o,S/o": {
          x: 110,
          y: 604,
          value: formData?.fatherName.toString(),
        },
        Name: { x: 395, y: 603, value: name.toString() },
        DOB: { x: 380, y: 568, value: formData?.dob.toString() },
        CNIC: { x: 95, y: 568, value: formData?.cnic.toString() },
        "Ph#": { x: 55, y: 536, value: formData?.cellNumber.toString() },
        Cell: { x: 217, y: 534, value: formData?.cellNumber.toString() },
        Education: { x: 440, y: 534, value: education.toString() },
        Address: { x: 90, y: 507, value: formData?.address.toString() },
        Fee: { x: 55, y: 476, value: formData?.totalPayment.toString() },
        Time: { x: 150, y: 476, value: time.toString() },
        "S.Date": { x: 305, y: 476, value: formData?.startDate.toString() },
        Date: { x: 460, y: 476, value: date.toString() },
        "Total Days": {
          x: 465,
          y: 405,
          value: formData?.courseduration.toString(),
        },
        Ddays: { x: 360, y: 405, value: drivingdays.toString() },
        Ldays: { x: 50, y: 405, value: learningdays.toString() },
        time: {
          x: 290,
          y: 405,
          value: formData?.courseTimeDuration.toString(),
        },
      };

      // Add text to the appropriate fields on the first page
      for (const [field, { x, y, value }] of Object.entries(data)) {
        firstPage.drawText(value, {
          x,
          y,
          size: 12,
          color: rgb(0, 0, 0),
        });
      }
      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(pdfBlob);
      setPreviewUrl(url);
      console.log("setting url");
    } catch (error) {
      console.error("Error filling PDF:", error);
    }
  }

  async function downloadPDF() {
    if (previewUrl) {
      const link = document.createElement("a");
      link.href = previewUrl;
      link.download = "filled-form.pdf";
      link.click();
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null); // Optional: Reset the URL after download
      closeModal();
    }
  }

  useEffect(() => {
    generatePDF();
  }, []);
  return (
    <>
      <Transition as={Fragment} show={open}>
        <Dialog onClose={closeModal} className="relative z-10">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg p-6 bg-white rounded shadow-lg">
                  <Dialog.Title className="text-lg font-semibold">
                    Preview
                  </Dialog.Title>

                  <div className="mt-6">
                    {previewUrl && (
                      <>
                        <div className="mt-4">
                          <iframe
                            src={previewUrl}
                            className="w-full mt-2 border rounded"
                            height={"300px"}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={closeModal}
                      className="mt-3 bg-red-500 text-white inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:mt-0 sm:w-auto"
                    >
                      Close
                    </button>
                    <button
                      onClick={downloadPDF}
                      style={{ backgroundColor: "#4bb543" }}
                      className="my-3 bg-green-500 text-white inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:mt-0 sm:w-auto"
                    >
                      Download PDF
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default PDFModal;
