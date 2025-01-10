import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { fetchInstructors } from "store/instructor/action";
import { format, parse, isWithinInterval } from "date-fns";
import { postAdmission } from "store/admission/actions";
import { toast } from "react-toastify";
import AvailabilityModal from "components/Modals/AvailabilityModal";
import { start } from "@popperjs/core";
import { fetchCourses } from "store/courses/actions";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import admissionFormPdf from "../../assets/pdf/admissionForm.pdf";
import PDFModal from "components/Modals/PDFModal";
export default function AdmissionCard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { courses } = useSelector((state) => state.course);
  const { registerLoading } = useSelector((state) => state.admission);
  const [open, setOpen] = useState(false);
  const { isInstructorLoading, instructors } = useSelector(
    (state) => state.instructor
  );
  const [openPreview, setOpenPreview] = useState(false);
  const [idx, setIdx] = useState("");
  const [priceIdx, setPriceIdx] = useState("");
  const [error, setError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [cnicError, setCnicError] = useState("");
  const [dobError, setDobError] = useState("");
  const [refNo, setRefNo] = useState("");
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    fatherName: "Robert Doe",
    cnic: "12345-6789012-3",
    gender: "Male",
    dob: "1995-01-01", // Use YYYY-MM-DD format for dates
    cellNumber: "+92 300 1234567",
    address: "123 Main Street, Islamabad",
    instructor: null,
    courseduration: "", // Example: 30 days
    courseTimeDuration: "", // Example: 90 minutes
    startDate: "", // Example date
    startTime: "",
    paymentMethod: "Cash",
    totalPayment: "", // Total payment in PKR
    paymentReceived: "", // Received payment in PKR
    remainingPayment: "", // Remaining payment in PKR
    manager: user,
    pickanddrop: false,
    pickanddropCharges: "",
    status: true, // Active status
    discount: "40", // Discount in PKR
    course: "Basic Driving Course",
    vehicle: "Toyota Corolla",
    paymentDueDate: null,
  });

  const [additionalTime, setAdditionalTime] = useState(0);
  // Function to format Date to accordingly
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Function to format time to hh:mm
  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const changeInstructor = (instructor) => {
    setFormData({
      ...formData,
      instructor: instructor,
    });
  };

  const changeStartDateTime = (startDate, endTime) => {
    let startdata = formatDate(startDate);
    let starttime = formatTime(startDate);
    const selectedDate = new Date(startdata);
    const day = selectedDate.getDay();
    if (day === 0) {
      setError("Sunday is a holiday. Please select another date.");
    } else {
      setError("");
    }
    const [hours, minutes] = starttime.split(":").map(Number);
    // if (minutes !== 0 && minutes !== 30) {
    //   setTimeError("Please select a time ending in 00 or 30 minutes.");
    //   return;
    // }
    if (hours < 9 || hours > 16 || (hours === 17 && minutes > 0)) {
      setTimeError("Time must be between 9:00 AM and 5:00 PM.");
      return;
    }
    setTimeError("");
    const selectedTime = format(parse(starttime, "HH:mm", new Date()), "hh:mm");
    const { instructor } = formData;
    if (instructor) {
      const isAvailable = checkInstructorAvailability(
        instructor,
        startDate,
        endTime
      );
      if (!isAvailable) {
        setTimeError("Instructor is not available at this time.");
        return;
      }
    }

    setFormData({
      ...formData,
      startDate: startdata,
      startTime: starttime,
    });
  };

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
    } else if (name === "paymentDueDate") {
      setFormData((prev) => ({ ...prev, paymentDueDate: value }));
    } else if (name === "course") {
      setIdx(value);
      setFormData({
        ...formData,
        course: courses[value]?.name,
        courseTimeDuration: courses[value]?.duration,
        vehicle: courses[value]?.vehicle,
      });
    } else if (
      name === "additionalTime" &&
      formData?.courseTimeDuration &&
      value >= 0
    ) {
      const number = Number(value);

      setAdditionalTime(number);
    } else if (name === "startTime") {
      const [hours, minutes] = value.split(":").map(Number);
      if (minutes !== 0 && minutes !== 30 && minutes !== 15 && minutes !== 45) {
        setTimeError("Please select a time ending in 00 or 30 minutes.");
        return;
      }
      if (hours < 9 || hours > 16 || (hours === 17 && minutes > 0)) {
        setTimeError("Time must be between 9:00 AM and 5:00 PM.");
        return;
      }
      setTimeError("");
      const selectedTime = format(parse(value, "HH:mm", new Date()), "hh:mm");
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
    } else if (name === "cnic") {
      const digitsOnly = value.replace(/-/g, "");

      if (digitsOnly?.length > 13) {
        setCnicError("CNIC cannot exceed 13 digits.");
      } else if (digitsOnly?.length < 13) {
        setCnicError("CNIC should be minimum 13 digits.");
      } else {
        setCnicError("");
      }
      setFormData({
        ...formData,
        cnic: value,
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
      const numericValue = Number(courses[idx]?.pricelist[value]?.days);
      setPriceIdx(value);
      setFormData((prev) => ({
        ...prev,
        courseduration: numericValue,
        totalPayment: Number(courses[idx].pricelist[value].price),
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
    } else if (name === "pickanddropcharges") {
      const numericValue = Number(value);
      setFormData((prev) => ({
        ...prev,
        pickanddropCharges: numericValue,
      }));
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };
  const checkBookingConflict = (
    bookedSlots,
    selectedDate,
    selectedStartTime
  ) => {
    for (let i = 0; i < bookedSlots.length; i++) {
      const bookedSlot = bookedSlots[i];
      const { date, startTime, endTime } = bookedSlot;
      if (date === selectedDate) {
        const selectedStart = parse(selectedStartTime, "HH:mm", new Date());
        const bookedStart = parse(startTime, "HH:mm", new Date());
        const bookedEnd = parse(endTime, "HH:mm", new Date());
        if (
          (selectedStart >= bookedStart && selectedStart < bookedEnd) ||
          (selectedStart < bookedStart && selectedStart >= bookedStart)
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const checkInstructorAvailability = (
    instructor,
    selectedStartTime,
    selectedEndTime
  ) => {
    const bookedSlots = instructor.bookedSlots || [];

    // Ensure that selected times are valid Date objects
    if (
      !(selectedStartTime instanceof Date) ||
      !(selectedEndTime instanceof Date)
    ) {
      console.error("Selected start and end times must be Date objects.");
      return false;
    }

    for (let i = 0; i < bookedSlots.length; i++) {
      const bookedSlot = bookedSlots[i];
      const { startTime, endTime } = bookedSlot;

      if (!(startTime instanceof Date) || !(endTime instanceof Date)) {
        console.error("Booked start and end times must be Date objects.");
        continue; // Skip this slot if invalid
      }

      if (
        isWithinInterval(selectedStartTime, {
          start: startTime,
          end: endTime,
        }) ||
        isWithinInterval(selectedEndTime, { start: startTime, end: endTime }) ||
        (selectedStartTime <= startTime && selectedEndTime >= endTime) // Selected range completely overlaps booked range
      ) {
        return false; // Collision found
      }
    }
    return true; // No collisions
  };

  // async function createAdmissionPdf() {
  //   try {
  //     // Load the existing PDF file from the public folder
  //     const response = await fetch(admissionFormPdf);
  //     if (!response.ok) {
  //     throw new Error(`Failed to fetch PDF. Status: ${response.status}`);
  //     }
  //     const existingPdfBytes = await response.arrayBuffer(); // Read the file as an ArrayBuffer

  //     // Load the PDFDocument
  //     const pdfDoc = await PDFDocument.load(existingPdfBytes);

  //     // Get the first page of the PDF
  //     const pages = pdfDoc.getPages();
  //     const firstPage = pages[0];

  //     const { firstName, lastName, fatherName, cnic, dob, cellNumber, address, totalPayment, startDate } = formData;

  //     const name = firstName + " " + lastName;
  //     const education = "--";  // No field for education
  //     const currentTime = new Date();
  //     const time = `${currentTime.getHours()}:${currentTime.getMinutes()}`;
  //     const date = `${currentTime.getDate().toString().padStart(2, '0')}-${(currentTime.getMonth() + 1).toString().padStart(2, '0')}-${currentTime.getFullYear()}`;

  //     // Define the data and positions
  //     const data = {
  //       "D/o,W/o,S/o": { x: 110, y: 604, value: fatherName.toString() },
  //       "Name": { x: 395, y: 603, value: name.toString() },
  //       "DOB": { x: 380, y: 568, value: dob.toString() },
  //       "CNIC": { x: 95, y: 568, value: cnic.toString() },
  //       "Ph#": { x: 55, y: 536, value: cellNumber.toString() },
  //       "Cell": { x: 217, y: 534, value: cellNumber.toString() },
  //       "Education": { x: 440, y: 534, value: education.toString() },
  //       "Address": { x: 90, y: 507, value: address.toString() },
  //       "Fee": { x: 55, y: 476, value: totalPayment.toString() },
  //       "Time": { x: 150, y: 476, value: time.toString() },
  //       "S.Date": { x: 305, y: 476, value: startDate.toString() },
  //       "Date": { x: 460, y: 476, value: date.toString() },
  //     };

  //     // Add text to the appropriate fields on the first page
  //     for (const [field, { x, y, value }] of Object.entries(data)) {
  //       firstPage.drawText(value, {
  //         x,
  //         y,
  //         size: 12,
  //         color: rgb(0, 0, 0),
  //       });
  //     }

  //     // Save the updated PDF
  //     const pdfBytes = await pdfDoc.save();

  //     // Using FileSaver.js to trigger the download
  //     const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  //     saveAs(blob, 'admissionForm(filled).pdf');

  //   } catch (error) {
  //     console.error("Error filling PDF:", error);
  //   }
  // }

  async function createInvoicePdf() {
    try {
      // Extract invoice data
      const { totalPayment, discount, paymentReceived, remainingPayment } =
        formData;
      const netPayment = totalPayment - totalPayment * (discount / 100);

      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([400, 600]); // A6 page size

      // Load fonts
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Define colors and font sizes
      const black = rgb(0, 0, 0);
      const headerFontSize = 16;
      const fieldFontSize = 12;
      const lineSpacing = 20;

      let yPosition = 550; // Start at the top of the page

      // Add Header
      const pageWidth = 400; // Width of the page (example: A6 size, 400 points)

      // Draw "IQRA Driving School"
      const text1 = "IQRA Driving School";
      const text1Width = boldFont.widthOfTextAtSize(text1, headerFontSize);
      page.drawText(text1, {
        x: (pageWidth - text1Width) / 2, // Center align
        y: yPosition,
        size: headerFontSize,
        font: boldFont,
        color: black,
      });
      yPosition -= lineSpacing;

      // Draw "INVOICE"
      const text2 = "INVOICE";
      const text2Width = boldFont.widthOfTextAtSize(text2, headerFontSize);
      page.drawText(text2, {
        x: (pageWidth - text2Width) / 2, // Center align
        y: yPosition,
        size: headerFontSize,
        font: boldFont,
        color: black,
      });
      yPosition -= lineSpacing * 2;

      // Add Invoice Fields
      const fields = [
        { label: "Reference ID", value: "REFNUMBR123" },
        {
          label: "Total Payment (Without Discount)",
          value: totalPayment.toString(),
        },
        { label: "Discount", value: discount.toString() },
        { label: "Net Payment (With Discount)", value: netPayment.toString() },
        { label: "Payment Received", value: paymentReceived.toString() },
        { label: "Payment Remaining", value: remainingPayment.toString() },
      ];

      // Draw fields with bold labels
      fields.forEach(({ label, value }) => {
        // Draw Label (Bold)
        page.drawText(`${label}:`, {
          x: 50,
          y: yPosition,
          size: fieldFontSize,
          font: boldFont, // Use bold font for label
          color: black,
        });

        // Draw Value (Regular)
        page.drawText(value, {
          x: 300, // Align value next to the label
          y: yPosition,
          size: fieldFontSize,
          font: regularFont, // Use regular font for value
          color: black,
        });

        yPosition -= lineSpacing; // Move to the next line
      });

      // Add Footer
      page.drawText("Thank you for your payment!", {
        x: 50,
        y: 50, // Footer position
        size: fieldFontSize,
        font: regularFont,
        color: black,
      });

      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(blob);

      // Create and load the iframe

      const iframe = document.createElement("iframe");
      iframe.src = pdfUrl;
      iframe.style.position = "fixed";
      iframe.style.top = "0";
      iframe.style.left = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "none";

      document.body.appendChild(iframe);

      iframe.onload = () => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      };
    } catch (error) {
      console.error("Error creating invoice PDF:", error);
    }
  }
  const cleanUpFunction = () => {
    setError("");
    setTimeError("");
    setDobError("");
    setIdx("");
    setPriceIdx("");
    setRefNo("");
    setFormData({
      firstName: "John",
      lastName: "Doe",
      fatherName: "Robert Doe",
      cnic: "12345-6789012-3",
      gender: "Male",
      dob: "1995-01-01", // Use YYYY-MM-DD format for dates
      cellNumber: "+92 300 1234567",
      address: "123 Main Street, Islamabad",
      instructor: null,
      courseduration: "", // Example: 30 days
      courseTimeDuration: "", // Example: 90 minutes
      startDate: "", // Example date
      startTime: "",
      paymentMethod: "Cash",
      totalPayment: "", // Total payment in PKR
      paymentReceived: "", // Received payment in PKR
      remainingPayment: "", // Remaining payment in PKR
      manager: user,
      status: true, // Active status
      discount: "40", // Discount in PKR
      course: "",
      vehicle: "",

      pickanddrop: false,
      pickanddropCharges: "",
      paymentDueDate: "",
    });
  };

  useEffect(() => {
    if (!openPreview) cleanUpFunction();
  }, [openPreview]);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("works");
    setFormData((prev) => ({
      ...prev,
      courseTimeDuration: formData?.courseTimeDuration + additionalTime,
      paymentDueDate:
        formData?.remainingPayment > 0 ? formData?.paymentDueDate : null,
    }));
    const { instructor, startDate, startTime } = formData;
    if (!instructor) {
      toast.error("Choose Instructor first");
      return;
    }
    const conflict = checkBookingConflict(
      instructor?.bookedSlots,
      startDate,
      startTime
    );
    if (conflict) {
      toast.error("Instructor is already booked at this time.");
      return;
    }

    dispatch(postAdmission({ formData }))
      .then((response) => {
        if (response?.payload?.status === true) {
          setRefNo(response?.payload?.refNumber);
          setOpenPreview(true);
        }
      })
      .catch((error) => {
        console.error("Submission failed:", error);
      });
  };

  useEffect(() => {
    dispatch(fetchInstructors());
    dispatch(fetchCourses());
  }, []);
  useEffect(() => {
    if (!formData?.pickanddrop) {
      setFormData((prev) => ({ ...prev, pickanddropCharges: "" }));
    }
  }, [formData?.pickanddrop]);

  useEffect(() => {
    const total = formData?.pickanddropCharges
      ? Number(formData?.pickanddropCharges) + formData?.totalPayment
      : formData?.totalPayment;
    const discountedTotal = formData.discount
      ? parseFloat(total || 0) -
        parseFloat(total || 0) * (parseFloat(formData.discount || 0) / 100)
      : parseFloat(total || 0);
    const remaining =
      discountedTotal - parseFloat(formData.paymentReceived || 0);

    setFormData((prev) => ({
      ...prev,
      remainingPayment: remaining >= 0 ? remaining : 0,
    }));
  }, [formData.totalPayment, formData.paymentReceived, formData.discount]);
  const total = formData?.pickanddropCharges
    ? Number(formData?.pickanddropCharges) + formData?.totalPayment
    : formData?.totalPayment;
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
              <h6 className="text-blueGray-700 text-center text-lg w-full pl-4 mb-6 font-bold">
                Peronal Info
              </h6>
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
                    pattern="^\d{5}-\d{7}-\d{1}$"
                    value={formData.cnic}
                    onChange={handleChange}
                    placeholder="62202-5658860-7"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                  />
                  {cnicError && (
                    <p className="text-red-500 text-xs italic mt-2">
                      {cnicError}
                    </p>
                  )}
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
              <h6 className="text-blueGray-700 text-center text-lg w-full pl-4 my-6 font-bold">
                Course
              </h6>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="course"
                  >
                    Course
                  </label>
                  <select
                    required
                    id="course"
                    name="course"
                    value={idx}
                    onChange={handleChange}
                    className="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                  >
                    <option value="" disabled>
                      Select Course
                    </option>
                    {courses.map((course, index) => (
                      <option value={index} key={course?._id}>
                        {course?.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="vehicle"
                  >
                    Vehicle
                  </label>
                  <input
                    required
                    name="vehicle"
                    readOnly
                    value={formData?.vehicle}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="courseduration"
                  >
                    Duration
                  </label>
                  <select
                    required
                    id="courseduration"
                    name="courseduration"
                    value={priceIdx}
                    onChange={handleChange}
                    className="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                  >
                    <option value="" disabled>
                      Select Duration (Days)
                    </option>

                    {courses[idx]?.pricelist.map((course, index) => (
                      <option value={index} key={course?._id}>
                        {course?.days} Day{`${course?.days > 1 ? "s" : ""}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <h6 className="text-blueGray-700 text-center text-lg w-full pl-4 my-6 font-bold">
                Instructor
              </h6>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <div className="flex justify-between gap-2">
                    <button
                      onClick={() => {
                        if (
                          formData?.courseTimeDuration > 0 &&
                          formData?.courseduration > 0
                        ) {
                          setOpen(true);
                        } else {
                          toast.error("Fill Course Duration and Time Duration");
                        }
                      }}
                      type="button"
                      className="px-6 py-3 bg-lightBlue-600 item-self mx-auto text-white font-bold rounded-md shadow hover:bg-lightBlue-700 transition-all"
                    >
                      Book Instructor/Slots
                    </button>
                  </div>
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
                    readOnly
                    required
                    type="number"
                    id="courseTimeDuration"
                    name="courseTimeDuration"
                    value={formData.courseTimeDuration + additionalTime}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="startDate"
                  >
                    Start Date
                  </label>
                  <input
                    readOnly
                    required
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={handleChange}
                    // readOnly
                    placeholder="Select Start Date"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150 "
                  />
                  {error && (
                    <p className="text-red-500 text-xs italic mt-2">{error}</p>
                  )}
                </div>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="startTime"
                  >
                    Start Time
                  </label>
                  <input
                    readOnly
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
              <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="additionalTime"
                  >
                    Additional Time
                  </label>
                  <input
                    type="number"
                    id="additionalTime"
                    name="additionalTime"
                    value={additionalTime}
                    onChange={handleChange}
                    min={0}
                    placeholder="Enter Additional Time (mins)"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                  />
                  {timeError && (
                    <p className="text-red-500 text-xs mt-1">{timeError}</p>
                  )}
                </div>
              </div>
              <h6 className="text-blueGray-700 text-center text-lg w-full pl-4 my-6 font-bold">
                Payment
              </h6>
              <div className="w-full lg:w-4/12 px-4">
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
                  <div className="flex items-center mt-10">
                    <input
                      id="pickanddrop"
                      name="pickanddrop"
                      type="checkbox"
                      checked={formData.pickanddrop}
                      onChange={handleChange}
                      aria-describedby="comments-description"
                      className="h-6 w-6 rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 focus:outline-none"
                    />
                    <label
                      htmlFor="pickanddrop"
                      className="uppercase text-blueGray-600 text-xs font-bold px-2"
                    >
                      Pick And Drop
                    </label>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                {formData?.pickanddrop && (
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="pickanddropcharges"
                    >
                      Pick And Drop Charges
                    </label>
                    <input
                      type="number"
                      min={1}
                      id="pickanddropcharges"
                      name="pickanddropcharges"
                      value={formData.pickanddropCharges}
                      placeholder="Enter Pick and Charges"
                      onChange={handleChange}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                    />
                  </div>
                )}
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
                    readOnly
                    type="number"
                    min={1}
                    id="totalPayment"
                    name="totalPayment"
                    value={total}
                    onChange={handleChange}
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
                {formData?.remainingPayment > 0 && (
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="paymentDueDate"
                    >
                      Due Date For Remaining Pay
                    </label>
                    <input
                      type="date"
                      id="paymentDueDate"
                      name="paymentDueDate"
                      value={formData?.paymentDueDate}
                      onChange={handleChange}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                    />
                  </div>
                )}
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="discount"
                  >
                    Discount
                  </label>
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    value={formData?.discount}
                    placeholder="Enter discount"
                    onChange={handleChange}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
              <div className="w-full lg:w-4/12 px-4">
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
              <div className="w-full lg:w-4/12 px-4">
                <p className="mt-8">
                  Discounted Total:{" "}
                  {total - total * (formData?.discount / 100) || 0}
                </p>
              </div>
            </div>
            <div className="flex justify-end items-center px-4 py-3">
              <button
                type="submit"
                disabled={registerLoading}
                className="bg-lightBlue-600 text-white text-md font-bold py-2 px-4 rounded focus:outline-none"
              >
                {registerLoading ? (
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
      {openPreview && (
        <PDFModal
          formData={formData}
          refNo={refNo}
          open={openPreview}
          setOpen={setOpenPreview}
        />
      )}
      {formData?.courseduration &&
        formData?.courseTimeDuration &&
        formData?.firstName &&
        formData?.lastName &&
        formData?.vehicle &&
        formData?.address &&
        formData?.cellNumber && (
          <AvailabilityModal
            open={open}
            setOpen={setOpen}
            courseduration={formData?.courseduration}
            courseTimeDuration={formData?.courseTimeDuration}
            changeStartDateTime={changeStartDateTime}
            instructorAvailability={formData?.instructor?.availability}
            name={formData?.firstName + " " + formData?.lastName}
            car={formData?.vehicle}
            phone={formData?.cellNumber}
            area={formData?.address}
            changeInstructor={changeInstructor}
            additionalTime={additionalTime}
          />
        )}
    </>
  );
}
