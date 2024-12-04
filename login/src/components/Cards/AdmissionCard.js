import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { fetchInstructors } from "store/instructor/action";
import { format, parse } from "date-fns";
import { postAdmission } from "store/admission/actions";
// components

export default function AdmissionCard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isInstructorLoading, instructors } = useSelector(
    (state) => state.instructor
  );
  const [error, setError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [dobError, setDobError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    cnic: "",
    gender: "",
    dob: "",
    cellNumber: "",
    address: "",
    instructor: null,
    courseduration: "",
    courseTimeDuration: "",
    startDate: "",
    startTime: "",
    paymentMethod: "",
    totalPayment: "",
    paymentReceived: "",
    paymentInInstallments: false,
    remainingPayment: "",
    manager: user,
    status: true,
  });
  console.log(formData, "formData>>>>>>>>>>>>>");
  useEffect(() => {
    dispatch(fetchInstructors());
  }, []);
  useEffect(() => {
    const remaining =
      parseFloat(formData.totalPayment || 0) -
      parseFloat(formData.paymentReceived || 0);
    setFormData((prev) => ({
      ...prev,
      remainingPayment: remaining >= 0 ? remaining : 0,
    }));
  }, [formData.totalPayment, formData.paymentReceived]);
  console.log(formData, formData?.instructor?.name, "formdata>>>>>>>>>>>>>");
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    if (name === "instructor") {
      const selectedInstructor = instructors.find(
        (instructor) => instructor.name === value
      );
      setFormData({
        ...formData,
        instructor: selectedInstructor,
      });
    } else if (name === "startTime") {
      const [hours, minutes] = value.split(":").map(Number);
      if (minutes !== 0 && minutes !== 30) {
        setTimeError("Please select a time ending in 00 or 30 minutes.");
        return;
      }
      if (hours < 9 || hours > 16 || (hours === 17 && minutes > 0)) {
        setTimeError("Time must be between 9:00 AM and 5:00 PM.");
        return;
      }
      setTimeError("");
      const selectedTime = format(parse(value, "HH:mm", new Date()), "hh:mm");
      console.log(selectedTime, "selectedTime>>>>>>>>>>>>>");
      const { instructor } = formData;
      if (instructor) {
        const isAvailable = checkInstructorAvailability(
          instructor,
          selectedTime
        );
        if (!isAvailable) {
          setTimeError("Instructor is not available at this time.");
          return;
        }
      }
      setFormData({
        ...formData,
        startTime: selectedTime,
      });
    } else if (name === "startDate") {
      const selectedDate = new Date(value);
      const day = selectedDate.getDay();
      if (day === 0) {
        setError("Sunday is a holiday. Please select another date.");
      } else {
        setError("");
      }
      setFormData({
        ...formData,
        startDate: value,
      });
    } else if (name === "dob") {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const isBeforeBirthday =
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate());
      const calculatedAge = isBeforeBirthday ? age - 1 : age;
      if (calculatedAge < 15) {
        setDobError("Age must be at least 15 years.");
        return;
      }
      setDobError("");
      setFormData({
        ...formData,
        dob: value,
      });
    } else if (name === "courseduration") {
      const numericValue = Number(value);
      setFormData((prev) => ({
        ...prev,
        courseduration: numericValue,
      }));
    } else if (name === "totalPayment") {
      const numericValue = Number(value);
      setFormData((prev) => ({
        ...prev,
        totalPayment: numericValue,
      }));
    } else if (name === "paymentReceived") {
      const numericValue = Number(value);
      setFormData((prev) => ({
        ...prev,
        paymentReceived: numericValue,
      }));
    } else if (name === "remainingPayment") {
      const numericValue = Number(value);
      setFormData((prev) => ({
        ...prev,
        remainingPayment: numericValue,
      }));
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };
  const checkInstructorAvailability = (instructor, selectedTime) => {
    console.log(instructor, selectedTime, "parameters>>>>>>>>>");
    // Look for the selected time slot in the instructor's available slots
    const timeSlot = instructor.timeSlots.find(
      (slot) => slot.time === selectedTime
    );
    console.log(timeSlot, "timeSlot>>>>>>>>>>>>>");

    return timeSlot ? timeSlot.status === "free" : false; // Return true if available, false otherwise
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData, "submitted Data>>>>>>>>>");
    dispatch(postAdmission({ formData }))
      .then((response) => {
        if (response.meta.requestStatus === "fulfilled") {
          setError("");
          setTimeError("");
          setDobError("");
          setFormData({
            firstName: "",
            lastName: "",
            fatherName: "",
            cnic: "",
            gender: "",
            dob: "",
            cellNumber: "",
            address: "",
            instructor: "",
            courseduration: "",
            courseTimeDuration: "",
            startDate: "",
            startTime: "",
            paymentMethod: "",
            totalPayment: "",
            paymentReceived: "",
            paymentInInstallments: false,
            remainingPayment: "",
            manager: user,
            status: true,
          });
        }
      })
      .catch((error) => {
        console.error("Submission failed:", error);
      });
  };
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="flex justify-center items-center ">
            <h6 className="text-blueGray-700 text-xl font-bold">
              Student Admission Form
            </h6>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap mt-6">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    First Name
                  </label>
                  <input
                    required
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter First Name"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Last Name
                  </label>
                  <input
                    required
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter Last Name"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="fatherName"
                  >
                    Father Name
                  </label>
                  <input
                    required
                    id="fatherName"
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    placeholder="Enter Father Name"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="cnic"
                  >
                    CNIC
                  </label>
                  <input
                    required
                    id="cnic"
                    type="text"
                    name="cnic"
                    value={formData.cnic}
                    onChange={handleChange}
                    placeholder="Enter CNIC"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="cellNumber"
                  >
                    Phone Number
                  </label>
                  <input
                    required
                    type="text"
                    name="cellNumber"
                    value={formData.cellNumber}
                    onChange={handleChange}
                    placeholder="Enter Phone Number"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="gender"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData?.gender}
                    onChange={handleChange}
                    className="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="dob"
                  >
                    Date of Birth
                  </label>
                  <input
                    required
                    id="dob"
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    placeholder="Select Date of Birth"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                  />
                  {dobError && (
                    <p className="text-red-500 text-xs italic mt-2">
                      {dobError}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-full px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="address"
                  >
                    Address
                  </label>
                  <textarea
                    required
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter Full Address"
                    rows={2}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none ease-linear transition-all duration-150"
                    defaultValue={""}
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="instructor-select"
                  >
                    Instructor
                  </label>
                  <select
                    required
                    id="instructor-select"
                    name="instructor"
                    value={formData?.instructor?.name || ""}
                    onChange={handleChange}
                    className="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                  >
                    <option value="" disabled>
                      Select Instructor
                    </option>
                    {instructors?.map((instructor) => (
                      <option key={instructor?.id} value={instructor.name}>
                        {instructor?.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="courseduration"
                  >
                    Course Duration
                  </label>
                  <input
                    required
                    type="number"
                    name="courseduration"
                    value={formData.courseduration}
                    onChange={handleChange}
                    placeholder="Enter Course Duration"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="courseTimeDuration"
                  >
                    Time Duration/Day
                  </label>
                  <input
                    required
                    type="number"
                    id="courseTimeDuration"
                    name="courseTimeDuration"
                    value={formData.courseTimeDuation}
                    onChange={handleChange}
                    min={1}
                    step={1}
                    placeholder="Enter Time Duration/Day"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="startDate"
                  >
                    Start Date
                  </label>
                  <input
                    required
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={handleChange}
                    placeholder="Select Start Date"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150 "
                  />
                  {error && (
                    <p className="text-red-500 text-xs italic mt-2">{error}</p>
                  )}
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="startTime"
                  >
                    Start Time
                  </label>
                  <input
                    required
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    placeholder="Select Start Time"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                  />
                  {timeError && (
                    <p className="text-red-500 text-xs mt-1">{timeError}</p>
                  )}
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="paymentMethod"
                  >
                    Payment Method
                  </label>
                  <select
                    required
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData?.paymentMethod}
                    onChange={handleChange}
                    className="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                  >
                    <option value="" disabled>
                      Select Payment Method
                    </option>
                    <option value="cash">Cash</option>
                    <option value="easypaisa">EasyPaisa</option>
                    <option value="bankTransfer">Bank Transfer</option>
                  </select>
                </div>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="totalPayment"
                  >
                    Total Payment
                  </label>
                  <input
                    required
                    type="number"
                    min={1}
                    name="totalPayment"
                    value={formData.totalPayment}
                    onChange={handleChange}
                    placeholder="Enter Total Payment"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="paymentReceived"
                  >
                    Payment Recieved
                  </label>
                  <input
                    required
                    type="number"
                    min={1}
                    id="paymentReceived"
                    name="paymentReceived"
                    value={formData.paymentReceived}
                    onChange={handleChange}
                    placeholder="Enter Payment Recieved Amount"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                  <div className="flex items-center mt-10">
                    <input
                      id="paymentInInstallments"
                      name="paymentInInstallments"
                      type="checkbox"
                      checked={formData.paymentInInstallments}
                      onChange={handleChange}
                      aria-describedby="comments-description"
                      className="h-6 w-6 rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 focus:outline-none"
                    />
                    <label
                      htmlFor="paymentInInstallments"
                      className="uppercase text-blueGray-600 text-xs font-bold px-2"
                    >
                      Payment In Installments
                    </label>
                  </div>
                </div>
              </div>
              <div className="w-full px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="remainingPayment"
                  >
                    Remaining Payment
                  </label>
                  <input
                    readOnly
                    type="number"
                    id="remainingPayment"
                    name="remainingPayment"
                    value={formData.remainingPayment}
                    placeholder="Remaining Payment"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end items-center px-4 py-3">
              <button
                type="submit"
                disabled={isInstructorLoading}
                class="bg-lightBlue-600 text-white text-md font-bold py-2 px-4 rounded focus:outline-none"
              >
                {isInstructorLoading ? (
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray animate-spin dark:text-gray fill-white "
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
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
