import React, { useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { fetchAdmissions, updateAdmission } from "store/admission/actions";
import { fetchInstructors } from "store/instructor/action";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { ReactComponent as EditIcon } from "../../assets/img/edit.svg";
import PDFModal from "components/Modals/PDFModal";
import ExtensionModal from "components/Modals/ExtensionModal";

export default function AdmissionTable({ color = "light", title }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const instructors = useSelector((state) => state.instructor.instructors);
  const [openPreview, setOpenPreview] = useState(false);
  const [open, setOpen] = useState(false);
  const [refNo, setRefNo] = useState("");
  const [formData, setFormData] = useState({});
  const [idx, setIdx] = useState(null);

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
    dispatch(fetchInstructors(user?.branch?._id));
  }, [user, dispatch]);

  const handleEdit = (student) => {
    // If clicking the same student's edit button, close the form
    if (editingId === student._id) {
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
    } else {
      // If clicking a different student's edit button, show their form
      setEditingId(student._id);
      setEditForm({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        fatherName: student.fatherName || "",
        cnic: student.cnic || "",
        gender: student.gender || "",
        dob: student.dob
          ? new Date(student.dob).toISOString().split("T")[0]
          : "",
        cellNumber: student.cellNumber || "",
        address: student.address || "",
      });
    }
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
        setFormData(result.data); // store the student object for pdf preview
        setRefNo(result.data.referenceNumber);
        handleCancel(); // Clear form and exit edit mode
        dispatch(fetchAdmissions(user?.branch?._id));
        setOpenPreview(true); // Open the pdf download preview
      }
    } catch (error) {
      // Handle error in UI
      console.error("Error updating student:", error);
    }
  };

  const findInstructorName = (id) => {
    const instructor = instructors.find((instructor) => instructor._id === id);
    return instructor ? instructor.name : "Not found.";
  };

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "admissions.csv";
  link.click();
  };
  const [sortByProperty, setSortByProperty] = useState({
    key: null,
    direction: null,
  });
  const handleSort = (column) => {
    if (sortByProperty.key === column) {
      setSortByProperty({
        key: column,
        direction:
          sortByProperty.direction === "ascending" ? "descending" : "ascending",
      });
    } else {
      setSortByProperty({
        key: column,
        direction: "descending",
      });
    }
  };
  const sortedAdmissions = [...admissions].sort((a, b) => {
    const { key, direction } = sortByProperty;
    if (!key) {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateB - dateA;
    }
    const order = direction === "ascending" ? 1 : -1;
    return a[key] > b[key] ? order : -order;
  });

  const handleModal = (idx) => {
    setIdx(idx);
    setOpen(true);
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
                AdmissionTable
              </h3>
            </div>
            <div className="p-3">
              <button
                onClick={() => {}}
                className="bg-lightBlue-600 text-white text-md font-bold py-2 px-4 rounded focus:outline-none"
              >
                Download CSV
              </button>
            </div>
         <div className="mr-3">
              <button
                className="bg-lightBlue-600 text-white text-md font-bold py-2 px-4 rounded focus:outline-none"
              >Sort by date</button>
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
            <table className="items-center w-full border-collapse">
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
                    <i
                      onClick={() => handleSort("totalPayment")}
                      className="fas fa-solid fa-caret-down ml-1 cursor-pointer"
                    ></i>
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
                    <i
                      onClick={() => handleSort("paymentReceived")}
                      className="fas fa-solid fa-caret-down ml-1 cursor-pointer"
                    ></i>
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
                    <i
                      onClick={() => handleSort("remainingPayment")}
                      className="fas fa-solid fa-caret-down ml-1 cursor-pointer text-green-500"
                    ></i>
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
                            className="p-2 rounded-lg bg-lightBlue-500"
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
                          {format(new Date(admission?.startDate), "MM/dd/yyyy")}
                        </td>
                        <td className="border-t-0 px-6 text-center align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          {format(new Date(admission?.endDate), "MM/dd/yyyy")}
                        </td>
                        <td className="border-t-0 px-6 text-center align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          <button
                            onClick={handleModal.bind(null, index)}
                            className={`py-2 px-4 rounded text-white font-bold
                      bg-lightBlue-600 
                      `}
                          >
                            Extension
                          </button>
                        </td>
                      </tr>
                      {editingId === admission._id && (
                        <tr className="bg-blueGray-50">
                          <td colSpan="5" className="p-6">
                            <div className="flex flex-wrap">
                              <h6 className="text-blueGray-700 text-center text-lg w-full mb-3 font-bold">
                                Update Info
                              </h6>

                              {/* First Name */}
                              <div className="w-full lg:w-6/12 px-4">
                                <div className="relative w-full mb-3">
                                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
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
                                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                                    placeholder="Enter First Name"
                                    required
                                  />
                                </div>
                              </div>

                              {/* Last Name */}
                              <div className="w-full lg:w-6/12 px-4">
                                <div className="relative w-full mb-3">
                                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
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
                                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                                    placeholder="Enter Last Name"
                                    required
                                  />
                                </div>
                              </div>

                              {/* Father Name */}
                              <div className="w-full lg:w-6/12 px-4">
                                <div className="relative w-full mb-3">
                                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                    Father Name
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
                                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                                    placeholder="Enter Father Name"
                                    required
                                  />
                                </div>
                              </div>

                              {/* CNIC */}
                              <div className="w-full lg:w-6/12 px-4">
                                <div className="relative w-full mb-3">
                                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
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
                                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                                    placeholder="Enter CNIC"
                                    required
                                  />
                                </div>
                              </div>

                              {/* Gender */}
                              <div className="w-full lg:w-4/12 px-4">
                                <div className="relative w-full mb-3">
                                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
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
                                    className="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                                    required
                                  >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </div>
                              </div>

                              {/* Date of Birth */}
                              <div className="w-full lg:w-4/12 px-4">
                                <div className="relative w-full mb-3">
                                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
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
                                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                                    required
                                  />
                                </div>
                              </div>

                              {/* Cell Number */}
                              <div className="w-full lg:w-4/12 px-4">
                                <div className="relative w-full mb-3">
                                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
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
                                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                                    placeholder="Enter Cell Number"
                                    required
                                  />
                                </div>
                              </div>

                              {/* Address */}
                              <div className="w-full px-4">
                                <div className="relative w-full mb-3">
                                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
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
                                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                                    placeholder="Enter Address"
                                    required
                                    rows="2"
                                  />
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="w-full px-4 flex justify-end space-x-4 gap-2">
                                <button
                                  onClick={() => handleSave(admission._id)}
                                  className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleCancel}
                                  className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                                >
                                  Cancel
                                </button>
                              </div>
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
      {open && (
        <ExtensionModal
          open={open}
          setOpen={setOpen}
          courseTimeDuration={admissions[idx]?.courseTimeDuration}
          instructorId={admissions[idx]?.instructor}
          name={admissions[idx]?.firstName + " " + admissions[idx]?.lastName}
          car={admissions[idx]?.vehicle}
          phone={admissions[idx]?.cellNumber}
          area={admissions[idx]?.address}
          refNo={admissions[idx]?.referenceNumber}
        />
      )}
      {openPreview && (
        <PDFModal
          formData={formData}
          refNo={refNo}
          open={openPreview}
          setOpen={setOpenPreview}
        />
      )}
    </>
  );
}

// AdmissionTable.propTypes = {
//   color: PropTypes.oneOf(["light", "dark"]),
// };
