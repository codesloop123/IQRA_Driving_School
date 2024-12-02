const express = require("express");
const mongoose = require("mongoose");
const Admission = require("../models/Admission");
const router = express.Router();
const Instructor = require("../models/Instructor");
// function to generate reference number
const generateReferenceNumber = async (branchCode, lecturerCode) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );
  const endOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  );
  const admissionCount = await Admission.countDocuments({
    dateRegistered: {
      $gte: startOfMonth,
      $lt: endOfMonth,
    },
  });
  const entryOfMonth = (admissionCount + 1).toString().padStart(2, "0");
  return `${currentMonth
    .toString()
    .padStart(
      2,
      "0"
    )}-${entryOfMonth}-${lecturerCode}-${branchCode}-${currentYear}`;
};
const formatTime = (hours, minutes) => {
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  return `${formattedHours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};
const addTime = (startTime, durationMinutes) => {
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const totalMinutes = startHours * 60 + startMinutes + Number(durationMinutes);
  console.log(totalMinutes,"totalMinutes>>>>>>>>");
  const endHours = Math.floor(totalMinutes / 60) % 24;
  console.log(endHours,"endHours>>>>>>>>");
  const endMinutes = totalMinutes % 60;
  console.log(endMinutes,"endminutes>>>>>>>>>>>>>");
  return formatTime(endHours, endMinutes);
};

router.post("/add", async (req, res) => {
  console.log(req.body, "data>>>>>>>>>>");
  const {
    firstName,
    lastName,
    fatherName,
    cnic,
    gender,
    dob,
    cellNumber,
    address,
    instructor,
    courseduration,
    courseTimeDuration,
    startDate,
    startTime,
    paymentMethod,
    totalPayment,
    paymentReceived,
    paymentInInstallments,
    remainingPayment,
    manager,
    status,
  } = req.body;

  try {
    const referenceNumber = await generateReferenceNumber(
      manager.branch._id,
      instructor._id
    );
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + courseduration);
    const endTime = addTime(startTime, courseTimeDuration);
    console.log(endTime, "endTime>>>>>>>>>>>>>>>>>>");
    const instructorDoc = await Instructor.findById(instructor._id);
    if (!instructorDoc) {
      return res
        .status(404)
        .json({ status: false, message: "Instructor not found" });
    }
    const startIndex = instructorDoc.timeSlots.findIndex(
      (slot) => slot.time === startTime
    );
    const endIndex = instructorDoc.timeSlots.findIndex(
      (slot) => slot.time === endTime
    );
    console.log(startIndex, endIndex, "indexes>>>>>>>>>>>>>>>>>>>>");
    if (startIndex === -1 || endIndex === -1) {
      return res.status(400).json({
        status: false,
        message: "Invalid start or end time for booking slots.",
      });
    }

    const slotsToBook = instructorDoc.timeSlots.slice(startIndex, endIndex + 1);
    const isAnySlotBooked = slotsToBook.some(
      (slot) => slot.status === "booked"
    );

    if (isAnySlotBooked) {
      return res.status(400).json({
        status: false,
        message: "Slot is already booked.",
      });
    }

    for (let i = startIndex; i <= endIndex; i++) {
      instructorDoc.timeSlots[i].status = "booked";
    }

    await instructorDoc.save();
    const admission = new Admission({
      firstName,
      lastName,
      fatherName,
      cnic,
      gender,
      dob,
      cellNumber,
      address,
      instructor,
      courseduration,
      courseTimeDuration,
      startDate,
      startTime,
      endTime,
      endDate,
      paymentMethod,
      totalPayment,
      paymentReceived,
      paymentInInstallments,
      remainingPayment,
      referenceNumber,
      manager,
      status,
    });

    await admission.save();
    res
      .status(200)
      .json({ status: true, message: "Admission submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/:branch", async (req, res) => {
  const { branch } = req.params;
  try {
    const admissions = await Admission.find({ branch });
    res.status(200).json(admissions);
  } catch (error) {
    console.error("Error fetching admissions:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// PUT route to toggle student's active status
router.put("/:branch/:id/status", async (req, res) => {
  const { branch, id } = req.params;
  const { isActive } = req.body; // New status from the frontend

  try {
    const admission = await Admission.findOne({ _id: id, branch });

    if (!admission) {
      return res.status(404).json({ msg: "Admission not found" });
    }

    admission.isActive = isActive;

    if (!isActive) {
      // Student is being paused, set the pausedAt timestamp
      admission.pausedAt = new Date().getDate();
    } else {
      // Student is resuming, clear the pausedAt field
      admission.pausedAt = null;
    }

    await admission.save();
    res.status(200).json({
      msg: "Student status updated successfully",
      isActive: admission.isActive,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/:branch/finances", async (req, res) => {
  const { branch } = req.params;

  try {
    // Fetch admissions with payment details for the specific branch
    const admissions = await Admission.find({ branch });

    // You can customize this to return only relevant financial data
    const finances = admissions.map((admission) => ({
      firstName: admission.firstName,
      fatherName: admission.fatherName,
      referenceNumber: admission.referenceNumber,
      dateRegistered: admission.dateRegistered,
      paymentDetails: admission.paymentDetails,
      remainingAmount: admission.remainingAmount,
    }));

    res.status(200).json(finances);
  } catch (error) {
    console.error("Error fetching finances:", error);
    res.status(500).json({ msg: "Server error" });
  }
});
// Route to fetch instructors for a specific branch
router.get("/instructors/:branch", async (req, res) => {
  const { branch } = req.params;

  try {
    const instructors = await Instructor.find({ branch });
    if (!instructors) {
      return res
        .status(404)
        .json({ msg: "No instructors found for this branch." });
    }
    res.status(200).json(instructors);
  } catch (error) {
    console.error("Error fetching instructors:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Route to fetch admissions by instructor and branch
router.get("/:branch/instructor/:instructorName", async (req, res) => {
  const { branch, instructorName } = req.params;

  try {
    // Find admissions for the specific branch and instructor
    const admissions = await Admission.find({
      branch,
      instructor: instructorName,
    });

    if (!admissions || admissions.length === 0) {
      // If no admissions found, send an empty array with a 200 status
      return res.status(200).json([]);
    }

    // If admissions are found, return them
    res.status(200).json(admissions);
  } catch (error) {
    console.error("Error fetching admissions:", error);
    res.status(500).json({ msg: "Server error" });
  }
});
router.put("/:branch/:admissionId", async (req, res) => {
  const { branch, admissionId } = req.params;
  const { timeSlots } = req.body;

  if (!timeSlots || !Array.isArray(timeSlots)) {
    return res.status(400).json({ msg: "Invalid or missing timeSlots" });
  }

  try {
    // Find the admission document by branch and admissionId
    const admission = await Admission.findOne({ admissionId, branch });

    if (!admission) {
      return res.status(404).json({ msg: "Admission not found" });
    }

    // Replace all existing time slots for this admissionId with new ones
    admission.timeSlots = timeSlots.map((slot) => ({
      admissionId: admissionId,
      start: new Date(slot.start),
      end: new Date(slot.end),
      title: slot.title || "",
    }));

    // Save the updated admission document
    const updatedAdmission = await admission.save();
    res
      .status(200)
      .json({ msg: "Events updated successfully", updatedAdmission });
  } catch (error) {
    console.error("Error updating admission:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Route to get booked slots for an instructor in a specific branch
router.get("/:branch/:instructorId/slots", async (req, res) => {
  const { branch, instructorId } = req.params;

  try {
    // Find admissions by instructor and branch with their booked time slots
    const admissions = await Admission.find({
      branch,
      instructor: instructorId,
    });

    // Extract all time slots from admissions
    const bookedSlots = admissions.flatMap((admission) => admission.timeSlots);

    res.status(200).json(bookedSlots);
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
