const express = require("express");
const Admission = require("../models/Admission");
const router = express.Router();
const Instructor = require("../models/Instructor");
const Notification = require("../models/Notification");
const cron = require("node-cron");
const mongoose = require("mongoose");
cron.schedule("0 0 * * *", async () => {
  // This cron job runs every day at midnight
  await checkOverduePayments();
});

async function checkOverduePayments() {
  const today = new Date();
  try {
    const overdueAdmissions = await Admission.find({
      paymentDueDate: { $lt: today.toISOString() },
      remainingPayment: { $gt: 0 },
    });

    for (const admission of overdueAdmissions) {
      const existingNotification = await Notification.findOne({
        student: admission._id,
        eventDate: admission.paymentDueDate,
      });

      if (!existingNotification) {
        const newNotification = new Notification({
          message: `Payment overdue for student: ${admission.firstName} ${admission.lastName}`,
          status: false,
          eventDate: admission.paymentDueDate,
          student: admission._id,
          branch: admission.branch, // Assuming 'branch' is a string in Admission
          role: "manager", // Specify the role as needed
        });

        await newNotification.save();
        console.log(`Notification created for admission ID: ${admission._id}`);
      } else {
        console.log(
          `Notification already exists for admission ID: ${admission._id}`
        );
      }
    }
  } catch (error) {
    console.error("Error checking overdue payments:", error);
  }
}
const generateReferenceNumber = async (branchCode, lecturerCode) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const currentDate = new Date();

  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
  const admissionCount = await Admission.countDocuments({
    dateRegistered: {
      $gte: startOfMonth.toISOString(),
      $lte: endOfMonth.toISOString(),
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
      remainingPayment,
      discount,
      manager,
      course,
      vehicle,
      status,
      pickanddrop,
      pickanddropCharges,
      paymentDueDate,
    } = req.body;

    if (
      
      !instructor ||
      !courseduration ||
      !courseTimeDuration ||
      !startDate ||
      !startTime ||
      !paymentMethod ||
      !totalPayment ||
      !paymentReceived ||
      remainingPayment === undefined ||
      discount === undefined ||
      !manager ||
      !status ||
      !course ||
      !vehicle ||
      pickanddrop === undefined
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (remainingPayment > 0 && !paymentDueDate) {
      return res
        .status(400)
        .json({ message: "Please add the Payment Due Date" });
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
    const courseStartTime = startTime;
    const courseEndTime = calculateEndTime(startTime, courseTimeDuration);
    if (courseStartTime < availableStart || courseEndTime > availableEnd) {
      return res.status(400).json({
        status: false,
        message: "Requested time is outside instructor's availability.",
      });
    }
    const { endDate, adjustedDuration } = calculateEndDate(
      startDate,
      courseduration
    );
    const bookedSlots = [];
    let currentStartDate = new Date(startDate);
    for (let i = 0; i < adjustedDuration; i++) {
      if (currentStartDate.getDay() === 0) {
        currentStartDate.setDate(currentStartDate.getDate() + 1);
        continue;
      }
      bookedSlots.push({
        date: formatDate(currentStartDate),
        startTime: courseStartTime,
        endTime: courseEndTime,
        refNo: referenceNumber,
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
      instructor: instructor._id,
      courseduration,
      courseTimeDuration,
      startDate,
      startTime,
      endTime: courseEndTime,
      endDate,
      paymentMethod,
      totalPayment,
      paymentReceived,
      remainingPayment,
      discount,
      referenceNumber,
      manager,
      vehicle,
      course,
      status,
      pickanddrop,
      pickanddropCharges: pickanddrop ? pickanddropCharges : null,
      paymentDueDate: paymentDueDate ? paymentDueDate : null,
    });

    const savedAdmission = await admission.save();
    if (savedAdmission) {
      const message = `Student: ${firstName} ${lastName} Has Been Added Successfully`;
      const eventDate = new Date();
      const newNotification = new Notification({
        message,
        status: true,
        eventDate,
        branch: null,
        role: "admin",
      });
      const result = await newNotification.save();
      return res.status(200).json({
        status: true,
        message: "Admission booked successfully.",
        bookedSlots,
        refNumber: admission.referenceNumber,
      });
    }
  } catch (error) {
    console.error("Error adding admission:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error." });
  }
});
const calculateEndTime = (startTime, duration) => {
  const [hours, minutes] = startTime.split(":").map(Number);
  // Parse the duration
  const durationMinutes = parseInt(duration, 10);

  // Calculate the new time
  const totalMinutes = hours * 60 + minutes + durationMinutes;

  // Convert back to hours and minutes
  const newHours = Math.floor(totalMinutes / 60) % 24; // Use % 24 to wrap around midnight
  const newMinutes = totalMinutes % 60;

  // Format the result in HH:MM
  const formattedTime = `${String(newHours).padStart(2, "0")}:${String(
    newMinutes
  ).padStart(2, "0")}`;

  return formattedTime;
};

const calculateEndDate = (startDate, durationInDays) => {
  // Parse the input date
  const date = new Date(startDate);
  // Add the duration to the date
  const positionInWeek = date.getDay();
  let y = durationInDays + Math.floor((positionInWeek + durationInDays) / 7);
  date.setDate(date.getDate() + parseInt(y, 10));

  // Format the result in YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return { endDate: `${year}-${month}-${day}`, adjustedDuration: y };
};
const formatDate = (date) => {
  return date.toISOString();
};
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const admissions = await Admission.find({ "manager.branch._id": id });
    res.status(200).json({ status: true, admissions: admissions });
  } catch (error) {
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

// Route to update only (firstName,lastName,fatherName,cnic,gender,dob,cellNumber,address) of the students enrolled
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Validate MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid MongoDB ID format");
      return res.status(400).json({ message: "Invalid admission ID format" });
    }
    // Find existing admission
    const existingAdmission = await Admission.findById(id);
    if (!existingAdmission) {
      console.log("Admission not found");
      return res.status(404).json({ message: "Admission not found" });
    }
    // Filter out undefined and empty values from request body
    const updatedData = Object.fromEntries(
      Object.entries(req.body).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );
    // Merge existing data with updates
    const finalUpdatedData = {
      ...existingAdmission.toObject(),
      ...updatedData,
      updatedAt: new Date(),
    };

    // Update admission
    const updatedAdmission = await Admission.findByIdAndUpdate(
      id,
      finalUpdatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAdmission) {
      return res.status(400).json({ message: "Update failed" });
    }

    return res.status(200).json({
      success: true,
      message: "Admission updated successfully",
      data: updatedAdmission,
    });
  } catch (error) {
    console.error("Error updating admission:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});
// PUT route to toggle student's active status
router.put("/:branch/:id/status", async (req, res) => {
  console.log("/:branch/:id/status");
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

router.put("/:branch/:admissionId", async (req, res) => {
  console.log("/:branch/:admissionId");
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

module.exports = router;
