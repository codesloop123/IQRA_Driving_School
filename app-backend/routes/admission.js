const express = require("express");
const Admission = require("../models/Admission");
const router = express.Router();
const Instructor = require("../models/Instructor");
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
router.post("/add", async (req, res) => {
  try {
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
      discount,
      manager,
      course,
      vehicle,
      status,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !fatherName ||
      !cnic ||
      !gender ||
      !dob ||
      !cellNumber ||
      !address ||
      !instructor ||
      !courseduration ||
      !courseTimeDuration ||
      !startDate ||
      !startTime ||
      !paymentMethod ||
      !totalPayment ||
      !paymentReceived ||
      paymentInInstallments === undefined ||
      remainingPayment === undefined ||
      discount === undefined ||
      !manager ||
      !status ||
      !course ||
      !vehicle
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const referenceNumber = await generateReferenceNumber(
      manager.branch.branchCode,
      instructor.lecturerCode
    );
    const instructorDoc = await Instructor.findById(instructor._id);
    if (!instructorDoc) {
      return res
        .status(404)
        .json({ status: false, message: "Instructor not found." });
    }
    const { startTime: availableStart, endTime: availableEnd } =
      instructorDoc.availability;
    console.log(availableStart, availableEnd, "availability>>>>>>>>>>>");
    const courseStartTime = startTime;
    console.log(courseStartTime, "courseStartTime>>>>>>>>>>>");
    const courseEndTime = calculateEndTime(startTime, courseTimeDuration);
    console.log(courseEndTime, "courseEndTIme>>>>>>>>");
    if (courseStartTime < availableStart || courseEndTime > availableEnd) {
      return res.status(400).json({
        status: false,
        message: "Requested time is outside instructor's availability.",
      });
    }
    const endDate = calculateEndDate(startDate, courseduration);
    const bookedSlots = [];
    let currentStartDate = new Date(startDate);
    for (let i = 0; i < courseduration; i++) {
      if (currentStartDate.getDay() === 0) {
        currentStartDate.setDate(currentStartDate.getDate() + 1);
        continue;
      }
      bookedSlots.push({
        date: formatDate(currentStartDate),
        startTime: courseStartTime,
        endTime: courseEndTime,
      });

      currentStartDate.setDate(currentStartDate.getDate() + 1);
    }
    const overlap = instructorDoc.bookedSlots.some((slot) => {
      return bookedSlots.some(
        (newSlot) =>
          slot.date === newSlot.date &&
          ((newSlot.startTime >= slot.startTime &&
            newSlot.startTime < slot.endTime) ||
            (newSlot.endTime > slot.startTime &&
              newSlot.endTime <= slot.endTime))
      );
    });

    if (overlap) {
      return res.status(400).json({
        status: false,
        message:
          "Some slots are already booked for the selected date and time.",
      });
    }
    instructorDoc.bookedSlots.push(...bookedSlots);
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
      endTime: courseEndTime,
      endDate,
      paymentMethod,
      totalPayment,
      paymentReceived,
      paymentInInstallments,
      remainingPayment,
      discount,
      referenceNumber,
      manager,
      vehicle,
      course,
      status,
    });

    await admission.save();
    res.status(200).json({
      status: true,
      message: "Admission booked successfully.",
      bookedSlots,
      refNumber: admission.referenceNumber
    });
  } catch (error) {
    console.error("Error adding admission:", error);
    res.status(500).json({ status: false, message: "Internal server error." });
  }
});
const calculateEndTime = (startTime, duration) => {
  const durationNumber = parseInt(duration, 10);
  let [hours, minutes] = startTime.split(":").map(Number);
  if (duration.length === 1) {
    hours += durationNumber;
  } else if (duration.length === 2) {
    minutes += durationNumber;
  }
  if (minutes >= 60) {
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;
  }
  if (hours > 12) {
    hours = hours % 12;
  }
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  return `${formattedHours}:${formattedMinutes}`;
};

const calculateEndDate = (startDate, durationDays) => {
  const start = new Date(startDate);
  let daysAdded = 0;

  while (daysAdded < durationDays) {
    start.setDate(start.getDate() + 1);
    if (start.getDay() !== 0) {
      daysAdded++;
    }
  }

  return formatDate(start);
};
const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const admissions = await Admission.find({ "manager.branch._id": id });
    console.log("admissions>>>>>>>>>>>>");
    console.log(admissions);
    res.status(200).json({ status: true, admissions: admissions });
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

//Route to fetch admissions finances
router.get("/:branch/finances", async (req, res) => {
  const { branch } = req.params;
  const { toDate, fromDate } = req.query;
  try {
    let admissions;
    // Fetch admissions within a specific date range:
    if (toDate && fromDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      admissions = await Admission.find({
        dateRegistered: {
          $gte: from,
          $lte: to,
        },
      });
    }
    // Fetch admissions with payment details for all branches
    else if (branch == "All") {
      admissions = await Admission.find();
    }
    // Fetch admissions with payment details for the specific branch
    else {
      admissions = await Admission.find({ "manager.branch._id": branch });
    }

    const finances = admissions.map((admission) => ({
      firstName: admission.firstName,
      fatherName: admission.fatherName,
      referenceNumber: admission.referenceNumber,
      dateRegistered: new Date(admission.dateRegistered)
        .toISOString()
        .split("T")[0],
      paymentDetails: {
        paymentMethod: admission.paymentMethod,
        totalPayment: admission.totalPayment,
        paymentReceived: admission.paymentReceived,
        discount: admission.discount,
        remainingPayment: admission.remainingPayment,
      },
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
