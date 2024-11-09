import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./admissions.css";
import Invoice from "./invoice";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Link } from "react-router-dom";

const localizer = momentLocalizer(moment);

const AdmissionsSixth = () => {
  const branch = "sixth";

  const [paymentDetails, setPaymentDetails] = useState({
    totalAmount: "",
    amountReceived: "",
    installment: false,
    paymentType: "",
  });

  const [selectedCourse, setSelectedCourse] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [formError, setFormError] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [invoiceData, setInvoiceData] = useState(null);
  const [recurringEvents, setRecurringEvents] = useState([]);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    fatherName: "",
    cnicNumber: "",
    gender: "",
    dateOfBirth: "",
    cellNumber: "",
    address: "",
    branchCode: "S",
    lecturerCode: "",
    dateRegistered: "",
    courseDuration: 0,
  });

  const [cars, setCars] = useState([]);
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("admissionData"));
    if (savedData) {
      setFormData(savedData.formData);
      setPaymentDetails(savedData.paymentDetails);
      setSelectedCourse(savedData.selectedCourse);
      setSelectedVehicle(savedData.selectedVehicle);
      setSelectedInstructor(savedData.selectedInstructor);
      setRemainingAmount(savedData.remainingAmount);
      setRecurringEvents(savedData.recurringEvents);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const carResponse = await axios.get(
          `http://62.72.57.154:5000/api/cars/${branch}`
        );
        setCars(carResponse.data);
        const instructorResponse = await axios.get(
          `http://62.72.57.154:5000/api/instructors/${branch}`
        );
        setInstructors(instructorResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setFormError("Failed to load options. Please try again later.");
      }
    };

    fetchData();
  }, [branch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    saveToLocalStorage(updatedFormData, paymentDetails);
  };

  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setPaymentDetails((prevDetails) => {
      const updatedDetails = { ...prevDetails, [name]: newValue };
      const total = parseFloat(updatedDetails.totalAmount) || 0;
      const received = parseFloat(updatedDetails.amountReceived) || 0;

      if (received > total) {
        setFormError("Amount received cannot exceed the total payment");
        setRemainingAmount(total);
      } else {
        setFormError("");
        setRemainingAmount(total - received);
      }

      saveToLocalStorage(formData, updatedDetails);
      return updatedDetails;
    });
  };

  const saveToLocalStorage = (formData, paymentDetails) => {
    const data = {
      formData,
      paymentDetails,
      selectedCourse,
      selectedVehicle,
      selectedInstructor,
      remainingAmount,
      recurringEvents,
    };
    localStorage.setItem("admissionData", JSON.stringify(data));
  };

  const handleVehicleChange = (e) => {
    setSelectedVehicle(e.target.value);
    setSelectedCourse("");
  };

  const handleInstructorChange = (e) => {
    const instructorId = e.target.value;
    const selectedInst = instructors.find((inst) => inst.id === instructorId);
    setSelectedInstructor(selectedInst);
    setFormData({ ...formData, lecturerCode: instructorId });
    setRecurringEvents([]);
    setAvailableEvents([]);
  };

  const handleCourseChange = (e) => {
    const selectedCourseValue = e.target.value;
    setSelectedCourse(selectedCourseValue);

    const [category, days] = selectedCourseValue.split(" - ");
    const selectedCourseDetails = courseData[category].find(
      (course) => course.days === days.trim()
    );

    if (selectedCourseDetails) {
      const durationInMinutes = selectedCourseDetails.time.includes("2 Hours")
        ? 120
        : parseInt(selectedCourseDetails.time);
      setAvailableEvents(generateAvailableEvents(durationInMinutes));
      setFormData((prev) => ({
        ...prev,
        courseDuration: parseInt(days.match(/\d+/)[0]),
      }));
    }
  };

  const generateAvailableEvents = (duration) => {
    const startTime = moment().hour(9).minute(0).local();
    const endTime = moment().hour(17).minute(0).local();
    const events = [];

    while (startTime.clone().add(duration, "minutes").isSameOrBefore(endTime)) {
      const start = startTime.clone().toDate();
      const end = startTime.clone().add(duration, "minutes").toDate();
      events.push({ title: "Select", start, end });
      startTime.add(duration, "minutes");
    }
    return events;
  };

  const handleSlotSelect = ({ start, end }) => {
    if (!selectedInstructor) {
      setFormError("Please select an instructor before choosing a time slot.");
      return;
    }

    const slots = [];
    let daysCount = 0;

    while (daysCount < formData.courseDuration) {
      const newStart = moment(start).add(daysCount, "days").local();
      const newEnd = moment(end).add(daysCount, "days").local();

      slots.push({
        admissionData: { admissionId: formData.admissionId },
        title: `${selectedInstructor.name} Class Slot`,
        start: newStart.toDate(),
        end: newEnd.toDate(),
      });

      daysCount++;
    }

    setRecurringEvents(slots);
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!navigator.onLine) {
        setFormError(
          "No internet connection. Data saved locally and will submit automatically once online."
        );
        return;
      }

      if (
        !selectedVehicle ||
        !selectedCourse ||
        !formData.lecturerCode ||
        !formData.dateRegistered ||
        !recurringEvents.length
      ) {
        setFormError(
          "Please complete all fields including selecting a time slot on the calendar"
        );
        return;
      }

      const admissionData = {
        ...formData,
        branchCode: "S",
        vehicle: selectedVehicle,
        course: selectedCourse,
        paymentDetails,
        remainingAmount,
        instructor: selectedInstructor ? selectedInstructor.name : "",
        timeSlots: recurringEvents,
      };

      try {
        const response = await axios.post(
          `http://62.72.57.154:5000/api/admissions/${branch}/submit`,
          admissionData
        );
        if (response.status === 201) {
          localStorage.removeItem("admissionData");
          setReferenceNumber(response.data.referenceNumber);
          setInvoiceData({
            ...admissionData,
            referenceNumber: response.data.referenceNumber,
            submissionDate: new Date().toLocaleDateString(),
          });
          setShowModal(true);
        }
      } catch (error) {
        console.error(
          "Error submitting the form:",
          error.response ? error.response.data : error.message
        );
        setFormError("Error submitting the form. Please try again.");
      }
    },
    [
      selectedVehicle,
      selectedCourse,
      formData,
      recurringEvents,
      paymentDetails,
      selectedInstructor,
      remainingAmount,
    ]
  );

  useEffect(() => {
    const handleOnline = async () => {
      const savedData = JSON.parse(localStorage.getItem("admissionData"));
      if (savedData) {
        try {
          await handleSubmit(new Event("submit"));
        } catch (error) {
          console.error("Retrying submission failed:", error);
        }
      }
    };

    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [handleSubmit]);

  const courseData = {
    Standard: [
      { days: "10 Days", time: "60 Minutes" },
      { days: "12 Days", time: "60 Minutes" },
      { days: "15 Days", time: "60 Minutes" },
      { days: "20 Days", time: "60 Minutes" },
      { days: "26 Days", time: "60 Minutes" },
    ],
    Refresher: [
      { days: "10 Days", time: "30 Minutes" },
      { days: "12 Days", time: "30 Minutes" },
      { days: "15 Days", time: "30 Minutes" },
      { days: "20 Days", time: "30 Minutes" },
      { days: "26 Days", time: "30 Minutes" },
    ],
    Advanced: [
      { days: "10 Days", time: "2 Hours" },
      { days: "12 Days", time: "2 Hours" },
      { days: "15 Days", time: "2 Hours" },
      { days: "20 Days", time: "2 Hours" },
      { days: "26 Days", time: "2 Hours" },
    ],
  };
  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: "white", // Set the background color to white
      color: "black", // Set text color to black for contrast
      borderRadius: "5px",
      border: "1px solid #ddd", // Optional: add a light border for visibility
      padding: "5px",
    };
    return { style };
  };

  return (
    <div className="admission-form">
      <h2>Admission Form</h2>
      {formError && <p className="error-message">{formError}</p>}
      {referenceNumber && (
        <p className="success-message">
          Generated Reference Number: {referenceNumber}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        {/* Personal Details */}
        <div className="form-group">
          <div className="input-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="Name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Father Name</label>
            <input
              type="text"
              name="fatherName"
              placeholder="Father Name"
              value={formData.fatherName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-group">
            <label>CNIC Number</label>
            <input
              type="text"
              name="cnicNumber"
              placeholder="CNIC Number"
              value={formData.cnicNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="input-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Cell Number</label>
            <input
              type="text"
              name="cellNumber"
              placeholder="Cell Number"
              value={formData.cellNumber}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Address Details */}
        <div className="form-group full-address">
          <label>Full Address</label>
          <textarea
            name="address"
            placeholder="Please type your address here..."
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Vehicle Selection */}
        <div className="form-group">
          <div className="input-group">
            <label>Select Vehicle</label>
            <select
              value={selectedVehicle}
              onChange={handleVehicleChange}
              required
            >
              <option value="">Select Vehicle</option>
              {cars.map((car) => (
                <option key={car._id} value={car.name}>
                  {`${car.name} - ${car.AutoMan}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Instructor Selection */}
        <div className="form-group">
          <div className="input-group">
            <label>Select Instructor</label>
            <select
              value={formData.lecturerCode}
              onChange={handleInstructorChange}
              required
            >
              <option value="">Select Instructor</option>
              {instructors.map((instructor) => (
                <option key={instructor._id} value={instructor.id}>
                  {`${instructor.name} - ${instructor.id}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Course Selection */}
        <div className="form-group">
          <div className="input-group">
            <label>Select Course</label>
            <select
              value={selectedCourse}
              onChange={handleCourseChange}
              required
            >
              <option value="">Select Course</option>
              {Object.entries(courseData).map(([category, options]) => (
                <optgroup label={category} key={category}>
                  {options.map((course, index) => (
                    <option key={index} value={`${category} - ${course.days}`}>
                      {`${category} - ${course.days} - ${course.time}`}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {/* Date Registered */}
        <div className="form-group">
          <div className="input-group">
            <label>Start Date</label>
            <input
              type="date"
              name="dateRegistered"
              value={formData.dateRegistered}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Calendar for Time Slot Selection */}
        <div className="calendar-container">
          <label>
            CHECK{" "}
            <Link to="/sidebar6/schedulesixth" style={{ color: "#007bff" }}>
              SCHEDULE PAGE
            </Link>{" "}
            IF TIME SLOT IS AVAILABLE FOR THIS INSTRUCTOR
          </label>
          <br />
          <label>Select Time Slot</label>
          <Calendar
            localizer={localizer}
            events={availableEvents}
            startAccessor="start"
            endAccessor="end"
            selectable
            defaultView="day"
            views={["day"]}
            onSelectSlot={handleSlotSelect}
            min={new Date(new Date().setHours(9, 0, 0))}
            max={new Date(new Date().setHours(17, 0, 0))}
            step={15}
            style={{ height: 400, width: 100 }}
            eventPropGetter={eventStyleGetter} // Apply the style function
          />
        </div>

        {/* Payment Details */}
        <div className="form-group payment-details">
          <div className="input-group">
            <label>Payment Type</label>
            <select
              name="paymentType"
              value={paymentDetails.paymentType}
              onChange={handlePaymentChange}
              required
            >
              <option value="">Select Payment Type</option>
              <option value="cash">Cash</option>
              <option value="bank transfer">Bank Transfer</option>
              <option value="easypaisa">Easypaisa</option>
            </select>
          </div>

          <div className="input-group">
            <label>Total Payment</label>
            <input
              type="number"
              name="totalAmount"
              value={paymentDetails.totalAmount}
              onChange={handlePaymentChange}
              placeholder="Total Payment"
              required
            />
          </div>
          <div className="input-group">
            <label>Payment Received</label>
            <input
              type="number"
              name="amountReceived"
              value={paymentDetails.amountReceived}
              onChange={handlePaymentChange}
              placeholder="Amount Received"
              required
            />
          </div>
          <div className="installment-group">
            <input
              type="checkbox"
              name="installment"
              checked={paymentDetails.installment}
              onChange={handlePaymentChange}
              id="installment-checkbox"
            />
            <label htmlFor="installment-checkbox" className="installment-label">
              Payment in Installments
            </label>
          </div>
        </div>

        {/* Remaining Payment */}
        <div className="form-group remaining-payment">
          <label>Remaining Payment</label>
          <input type="number" value={remainingAmount} readOnly />
        </div>

        {/* Submit Button */}
        <div className="form-group">
          <button type="submit">Submit</button>
        </div>
      </form>

      {/* Modal for Invoice */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-modal"
              onClick={() => {
                setShowModal(false); // Close the modal
                alert("\n Form submitted \n Adjust the schedule accordingly"); // Show success message
                window.location.href = "/sidebar6/schedulesixth";
              }}
            >
              ×
            </button>

            <Invoice data={invoiceData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionsSixth;
