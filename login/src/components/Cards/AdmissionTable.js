import React, { useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { fetchAdmissions, updateAdmission } from "store/admission/actions";
import { fetchInstructors } from "store/instructor/action";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { ReactComponent as EditIcon } from "../../assets/img/edit.svg";

export default function AdmissionTable({ color = "light", title }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const instructors = useSelector((state) => state.instructor.instructors);
  
  const { registerLoading, admissions } = useSelector(
    (state) => state.admission
  );
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    cnic: "",
    gender: "",
    dob: "",
    cellNumber: "",
    address: "",
  });
  // fetch instructors and admissions when the component mounts
  useEffect(() => {
    dispatch(fetchAdmissions(user?.branch?._id));
    dispatch(fetchInstructors());
  }, [user, dispatch]);

  const handleEdit = (student) => {
    setEditingId(student._id);
    setEditForm({
      firstName: student.firstName || "",
      lastName: student.lastName || "",
      fatherName: student.fatherName || "",
      cnic: student.cnic || "",
      gender: student.gender || "",
      dob: student.dob ? new Date(student.dob).toISOString().split("T")[0] : "",
      cellNumber: student.cellNumber || "",
      address: student.address || "",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({
      firstName: "",
      lastName: "",
      fatherName: "",
      cnic: "",
      gender: "",
      dob: "",
      cellNumber: "",
      address: "",
    });
  };

  const handleSave = async (id) => {
    try {
      const result = await dispatch(
        updateAdmission({
          id,
          formData: editForm,
        })
      ).unwrap();

      if (result) {
        handleCancel(); // Clear form and exit edit mode
        dispatch(fetchAdmissions(user?.branch?._id));
      }
    } catch (error) {
      // Handle error in UI
      console.error("Error updating student:", error);
    }
  };

  const findInstructorName = (id) => {
    const instructor = instructors.find((instructor) => instructor._id === id);
    return instructor? instructor.name : "Not found.";
  };

  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        <div className="rounded-t mb-0 px-2 py-3 border-0">
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
          </div>
        </div>
        {registerLoading ? (
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
                    Edit
                  </th>
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
                    Reference No
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                    }
                  >
                    CNIC
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                    }
                  >
                    instructor
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                    }
                  >
                    Payment Method
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                    }
                  >
                    Duration
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                    }
                  >
                    Time Duration/Day
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                    }
                  >
                    Total Payment
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                    }
                  >
                    Recieved Payment
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                    }
                  >
                    Remaining Payment
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                    }
                  >
                    Manager
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                    }
                  >
                    Start Date
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                    }
                  >
                    End Date
                  </th>

                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                    }
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {admissions?.length > 0 &&
                  admissions.map((admission, index) => (
                    <React.Fragment key={admission._id || index}>
                      <tr>
                        <td className="border-t-0 px-6 text-center align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          <button
                            className="px-2 py-2 rounded bg-lightBlue-500 hover:bg-lightBlue-700 transition-colors duration-200 flex items-center justify-center"
                            onClick={() => handleEdit(admission)}
                          >
                            <EditIcon />
                          </button>
                        </td>
                        <td className="border-t-0 px-6 text-center align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          {admission?.firstName}
                        </td>
                        <td className="border-t-0 px-6 text-center align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          {admission?.referenceNumber}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          {admission?.cnic}
                        </td>
                        <td className="border-t-0 px-6 text-center align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          {findInstructorName(admission.instructor)}
                        </td>
                        <td className="border-t-0 px-6 text-center align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          {admission?.paymentMethod}
                        </td>
                        <td className="border-t-0 px-6 text-center align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          {admission?.courseduration}
                        </td>
                        <td className="border-t-0 px-6 text-center align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          {admission?.courseTimeDuration}
                        </td>
                        <td className="border-t-0 px-6 text-center align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          {admission?.totalPayment}
                        </td>
                        <td className="border-t-0 px-6 text-center align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          {admission?.paymentReceived}
                        </td>
                        <td className="border-t-0 px-6 text-center align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          {admission?.remainingPayment}
                        </td>
                        <td className="border-t-0 px-6 text-center align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          {admission?.manager?.name}
                        </td>
                        <td className="border-t-0 px-6 text-center align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          {format(new Date(admission?.startDate), "MM/dd/yyyy")}
                        </td>
                        <td className="border-t-0 px-6 text-center align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          {format(new Date(admission?.endDate), "MM/dd/yyyy")}
                        </td>
                        <td className="border-t-0 px-6 text-center align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          <button
                            className={`py-2 px-4 rounded text-white font-bold
                      bg-lightBlue-600 
                      `}
                          >
                            Free Slots
                          </button>
                        </td>
                      </tr>
                      {editingId === admission._id && (
                        <tr className="bg-blueGray-50">
                          <td colSpan="5" className="px-6 py-4">
                            <div className="flex flex-col space-y-4">
                              {/* Form Grid */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                  <label className="text-sm font-medium">
                                    First Name
                                  </label>
                                  <input
                                    type="text"
                                    value={editForm.firstName}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        firstName: e.target.value,
                                      })
                                    }
                                    className="border rounded px-3 py-2"
                                    placeholder="Enter First Name"
                                    required
                                  />
                                </div>

                                <div className="flex flex-col">
                                  <label className="text-sm font-medium">
                                    Last Name
                                  </label>
                                  <input
                                    type="text"
                                    value={editForm.lastName}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        lastName: e.target.value,
                                      })
                                    }
                                    className="border rounded px-3 py-2"
                                    placeholder="Enter Last Name"
                                    required
                                  />
                                </div>

                                <div className="flex flex-col">
                                  <label className="text-sm font-medium">
                                    Father's Name
                                  </label>
                                  <input
                                    type="text"
                                    value={editForm.fatherName}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        fatherName: e.target.value,
                                      })
                                    }
                                    className="border rounded px-3 py-2"
                                    placeholder="Enter Father's Name"
                                    required
                                  />
                                </div>

                                <div className="flex flex-col">
                                  <label className="text-sm font-medium">
                                    CNIC
                                  </label>
                                  <input
                                    type="text"
                                    value={editForm.cnic}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        cnic: e.target.value,
                                      })
                                    }
                                    className="border rounded px-3 py-2"
                                    placeholder="Enter CNIC"
                                    required
                                  />
                                </div>

                                <div className="flex flex-col">
                                  <label className="text-sm font-medium">
                                    Gender
                                  </label>
                                  <select
                                    value={editForm.gender}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        gender: e.target.value,
                                      })
                                    }
                                    className="border rounded px-3 py-2"
                                    required
                                  >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </div>

                                <div className="flex flex-col">
                                  <label className="text-sm font-medium">
                                    Date of Birth
                                  </label>
                                  <input
                                    type="date"
                                    value={editForm.dob}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        dob: e.target.value,
                                      })
                                    }
                                    className="border rounded px-3 py-2"
                                    required
                                  />
                                </div>

                                <div className="flex flex-col">
                                  <label className="text-sm font-medium">
                                    Cell Number
                                  </label>
                                  <input
                                    type="tel"
                                    value={editForm.cellNumber}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        cellNumber: e.target.value,
                                      })
                                    }
                                    className="border rounded px-3 py-2"
                                    placeholder="Enter Cell Number"
                                    required
                                  />
                                </div>

                                <div className="flex flex-col">
                                  <label className="text-sm font-medium">
                                    Address
                                  </label>
                                  <textarea
                                    value={editForm.address}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        address: e.target.value,
                                      })
                                    }
                                    className="border rounded px-3 py-2"
                                    placeholder="Enter Address"
                                    required
                                    rows="2"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-row items-center justify-end mt-3 gap-2 w-full bg-gray-600">
                              <button
                                onClick={() => handleSave(admission._id)}
                                className="bg-green-600 text-white px-8 py-2 rounded transition-colors w-1/3 p-5"
                              >
                                Save
                              </button>

                              <button
                                onClick={handleCancel}
                                className="bg-red-500 text-white px-4 py-2 rounded w-1/3"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

AdmissionTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
