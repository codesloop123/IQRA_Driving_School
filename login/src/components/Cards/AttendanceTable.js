import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useState } from "react";
import { fetchBranches } from "store/branch/actions";
import { useEffect } from "react";
import { fetchVehicles } from "store/vehicle/actions";
import { fetchInstructors } from "store/instructor/action";
import { deleteInstructor } from "store/instructor/action";
import { updateInstructorStatus } from "store/instructor/action";
import { fetchAttendance } from "store/attendance/action";
export default function AttendanceTable({ color, title }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [date, setDate] = useState(null);

  const { isAttendanceLoading, students } = useSelector(
    (state) => state.attendance
  );

  useEffect(() => {
    console.log(date);
    dispatch(fetchAttendance({ branchid: user?.branch?._id, date }));
  }, [date]);

  const navigateButtonHandler = (action) => {
    if (!date) return;

    const currentDate = new Date(date);
    if (action === "INCREMENT")
      currentDate.setDate(currentDate.getDate() + 1); // Add one day
    else if (action === "DECREMENT")
      currentDate.setDate(currentDate.getDate() - 1); // Subtract one day
    setDate(currentDate.toISOString().split("T")[0]); // Format as YYYY-MM-DD
  };
  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        <div className="rounded-t mb-0 py-3 px-2 border-0">
          <div className="flex flex-wrap justify-between items-center">
            <div className="relative w-full pl-4 max-w-full flex-grow flex-1">
              <h3
                className={
                  "font-semibold text-lg " +
                  (color === "light" ? "text-blueGray-700" : "text-white")
                }
              >
                {title}
              </h3>
            </div>
            <div className="w-full lg:w-6/12 px-4 py-2">
              <div className="relative w-full ">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border-0 px-3 py-3 bg-blueGray-50 text-blueGray-500 border-blueGray-100 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
            <div className="mr-3">
              <button
                onClick={() => history.push("/add-attendance")}
                className="bg-lightBlue-600 text-white text-md font-bold py-2 px-4 rounded focus:outline-none"
              >
                Add New
              </button>
            </div>
          </div>
        </div>
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
          <div className="block w-full overflow-x-auto">
            {/* Projects table */}
            <table className="items-center w-full bg-transparent border-collapse">
              <thead>
                <tr>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                    }
                  >
                    Name
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                    }
                  >
                    Reference id
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                    }
                  >
                    status
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                    }
                  >
                    Attendance
                  </th>
                </tr>
              </thead>
              {students.length !== 0 ? (
                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className={`cursor-pointer hover:bg-lightBlue-100 `}
                    >
                      <td className="border-t-0 px-6 py-3 text-xs text-blueGray-500 align-middle whitespace-nowrap">
                        {student.name}
                      </td>
                      <td className="border-t-0 px-6 py-3 text-xs text-blueGray-500 align-middle whitespace-nowrap">
                        {student.refId}
                      </td>
                      <td className="border-t-0 px-6 py-3 text-xs text-blueGray-500 align-middle whitespace-nowrap">
                        {student.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <p
                  style={{ fontStyle: "italic" }}
                  className="text-gray-400 text-center py-4"
                >
                  No Attendance Sheet Available
                </p>
              )}
            </table>
          </div>
        )}
      </div>
      {date && (
        <div className="flex justify-between items-center">
          <div className={"block"}>
            <button
              onClick={navigateButtonHandler.bind(null, "DECREMENT")}
              class="bg-lightBlue-600 text-white text-md font-bold py-2 px-4 rounded focus:outline-none"
            >
              Prev Date
            </button>
          </div>

          <button
            onClick={navigateButtonHandler.bind(null, "INCREMENT")}
            className="bg-lightBlue-600 text-white text-md font-bold py-2 px-4 rounded focus:outline-none"
          >
            Next Date
          </button>
        </div>
      )}
    </>
  );
}

AttendanceTable.defaultProps = {
  color: "light",
};

AttendanceTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
