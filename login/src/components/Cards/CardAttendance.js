import React, { useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { fetchAttendees, postAttendance } from "store/attendance/action";
import { PDFDocument, rgb } from "pdf-lib";

async function downloadAttendancePDF(attendance, instructorname, date) {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Constants for layout
  const pageWidth = 600;
  const pageHeight = 800;
  const margin = 90;
  const fontSize = 12;
  const rowHeight = 30;
  const rowsPerPage = Math.floor((pageHeight - margin * 2) / rowHeight) - 3; // Reserve space for headers, title, and instructor name

  // Create a page
  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let yPosition = pageHeight - margin;

  // Function to draw headers and title
  const drawHeaders = () => {
    // Add instructor name
    page.drawText(`Instructor: ${instructorname}`, {
      x: margin,
      y: yPosition,
      size: fontSize,
      color: rgb(0, 0, 0.6),
    });

    // Add title
    page.drawText("Attendance Sheet", {
      x: pageWidth / 2 - 100,
      y: yPosition + 40,
      size: 20,
      color: rgb(0, 0, 0.8),
    });

    page.drawText(`Date: ${date}`, {
      x: pageWidth / 2 + 100,
      y: yPosition,
      size: fontSize,
      color: rgb(0, 0, 0.6),
    });

    yPosition -= rowHeight * 2; // Space for instructor and title

    // Add table headers
    const headers = ["Name", "RefID", "Attendance"];
    headers.forEach((header, index) => {
      page.drawText(header, {
        x: margin + index * 150,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
    });
    yPosition -= rowHeight; // Space below headers
  };

  // Add headers and title to the first page
  drawHeaders();

  // Add rows dynamically, spanning multiple pages if needed
  attendance.forEach(({ name, refId, instructorName }) => {
    if (instructorName !== instructorname) return;
    if (yPosition < margin) {
      // Add a new page if space runs out
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      yPosition = pageHeight - margin;
      drawHeaders();
    }

    // Draw row data
    const row = [name, refId, ""];
    row.forEach((cell, cellIndex) => {
      page.drawText(cell, {
        x: margin + cellIndex * 150,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
    });

    yPosition -= rowHeight;
  });

  // Serialize the PDF and trigger download
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${instructorname}-${date}.pdf`;
  link.click();
}
function downloadAllInstructorAttendance(attendance, date) {
  const uniqueInstructors = attendance.reduce((acc, item) => {
    if (!acc.includes(item.instructorName)) {
      acc.push(item.instructorName);
    }
    return acc;
  }, []);

  uniqueInstructors.forEach(
    async (entry) => await downloadAttendancePDF(attendance, entry, date)
  );
}

export default function CardAttendance() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [search, setSearch] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const { isAttendanceLoading, students } = useSelector(
    (state) => state.attendance
  );
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    if (date) dispatch(fetchAttendees({ branchid: user?.branch?._id, date }));
  }, [date]);
  useEffect(() => {
    setAttendanceData(students);
  }, [students]);
  const handleRowClick = (id) => {
    setSelectedRow(id);
  };

  const handleAttendance = (status) => {
    if (selectedRow !== null) {
      const updatedData = attendanceData.map((row) =>
        row._id === selectedRow ? { ...row, status } : row
      );
      console.log(updatedData);
      setAttendanceData(updatedData);
    }
  };
  const handleSave = () => {
    dispatch(
      postAttendance({
        date: date,
        attendance: attendanceData,
        branch: user?.branch?._id,
      })
    );
  };
  const filteredData = attendanceData.filter((row) =>
    row?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="flex items-center">
            <IoArrowBackOutline
              onClick={() => history.push("/attendance")}
              className="w-5 h-5 font-bold text-lightBlue-600 mr-2 cursor-pointer"
            />
            <h6 className="text-blueGray-700 text-xl font-bold">
              Add Attendance
            </h6>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <form>
            <div className="flex flex-wrap mt-6">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    Search
                  </label>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    placeholder="Search by name"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
            </div>
            <div className="w-full overflow-auto max-h-64 mb-4">
              {isAttendanceLoading ? (
                <div className="flex justify-center items-center py-10">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-gray animate-spin dark:text-gray fill-lightBlue-600 "
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={downloadAllInstructorAttendance.bind(
                      null,
                      filteredData,
                      date
                    )}
                    className="bg-lightBlue-600 text-white text-md font-bold py-2 px-4 rounded focus:outline-none my-4 self-end"
                  >
                    Download Attendance Sheet
                  </button>
                  <table className="items-center w-full bg-transparent border-collapse shadow-lg">
                    <thead className="bg-blueGray-50">
                      <tr>
                        <th className="px-6 py-3 text-xs text-blueGray-500 font-semibold text-left border-l-0 border-r-0 align-middle whitespace-nowrap">
                          Name
                        </th>
                        <th className="px-6 py-3 text-xs text-blueGray-500 font-semibold text-left border-l-0 border-r-0 align-middle whitespace-nowrap">
                          Ref ID
                        </th>
                        <th className="px-6 py-3 text-xs text-blueGray-500 font-semibold text-left border-l-0 border-r-0 align-middle whitespace-nowrap">
                          Instructor Name
                        </th>
                        <th className="px-6 py-3 text-xs text-blueGray-500 font-semibold text-left border-l-0 border-r-0 align-middle whitespace-nowrap">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {filteredData.map((row, index) => (
                        <tr
                          key={row._id}
                          onClick={() => handleRowClick(row._id)}
                          className={`cursor-pointer hover:bg-lightBlue-100 ${
                            selectedRow === row._id ? "bg-lightBlue-200" : ""
                          }`}
                        >
                          <td className="border-t-0 px-6 py-3 text-xs text-blueGray-500 align-middle whitespace-nowrap">
                            {row.name}
                          </td>
                          <td className="border-t-0 px-6 py-3 text-xs text-blueGray-500 align-middle whitespace-nowrap">
                            {row.refId}
                          </td>
                          <td className="border-t-0 px-6 py-3 text-xs text-blueGray-500 align-middle whitespace-nowrap">
                            {row.instructorName}
                          </td>
                          <td className="border-t-0 px-6 py-3 text-xs text-blueGray-500 align-middle whitespace-nowrap">
                            {row.status || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>

            <div className="flex justify-between items-center px-4 py-3">
              <div className="flex">
                <button
                  type="button"
                  onClick={() => handleAttendance("Present")}
                  className="bg-lightBlue-600 text-white text-md font-bold py-2 px-4 rounded focus:outline-none mr-4"
                >
                  Present
                </button>
                <button
                  type="button"
                  onClick={() => handleAttendance("Absent")}
                  className="bg-lightBlue-600 text-white text-md font-bold py-2 px-4 rounded focus:outline-none mr-4"
                >
                  Absent
                </button>
                <button
                  type="button"
                  onClick={() => handleAttendance("Leave")}
                  className="bg-lightBlue-600 text-white text-md font-bold py-2 px-4 rounded focus:outline-none"
                >
                  Leave
                </button>
              </div>
              <button
                type="button"
                onClick={handleSave}
                disabled={isAttendanceLoading}
                className="bg-lightBlue-600 text-white text-md font-bold py-2 px-4 rounded focus:outline-none"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
