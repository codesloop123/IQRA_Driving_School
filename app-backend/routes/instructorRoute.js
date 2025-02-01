// routes/instructor.js

const express = require("express");
const Instructor = require("../models/Instructor");
const router = express.Router();
const Notification = require("../models/Notification");
const mongoose = require("mongoose");
const Admission = require("../models/Admission");
const ObjectId = mongoose.Types.ObjectId;

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
router.post("/add", async (req, res) => {
  const { name, email, branch, vehicle, status, lecturerCode, availability } =
    req.body;

  if (
    !name ||
    !email ||
    !branch ||
    !vehicle ||
    !status ||
    !availability ||
    !lecturerCode
  ) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    let instructor = await Instructor.findOne({ email });
    if (instructor) {
      return res.status(200).json({ message: "Instructor already exists" });
    }

    // var lecturerCode = "12345";
    const newInstructor = new Instructor({
      name,
      email,
      lecturerCode,
      branch,
      vehicle,
      availability,
      status,
      bookedSlots: [],
    });
    // console.log(newInstructor);
    const savedInstructor = await newInstructor.save();
    if (savedInstructor) {
      const message = `Instructor: ${name} Has Been Added Successfully`;
      const eventDate = new Date();
      const newNotification = new Notification({
        message,
        status: true,
        eventDate,
        branch: branch._id,
        role: "manager",
      });
      await newNotification.save();
      res
        .status(200)
        .json({ status: true, message: "Instructor added successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET route to fetch all instructors for a specific branch
router.get("/fetch/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const instructors = await Instructor.find({
      "branch._id": new ObjectId(id),
    });
    res.status(200).json({ status: true, instructors: instructors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/fetch", async (req, res) => {
  try {
    const instructors = await Instructor.find();
    // console.log(instructors);
    res.status(200).json({ status: true, instructors: instructors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/fetch/slots/:students", async (req, res) => {
  const { students } = req.params;
  try {
    const lessons = await Instructor.aggregate([
      {
        $match: {
          _id: new ObjectId(students),
        },
      },
      {
        $unwind: "$bookedSlots",
      },
      {
        $lookup: {
          from: "admissions",
          localField: "bookedSlots.refNo",
          foreignField: "referenceNumber",
          as: "students",
        },
      },
      {
        $unwind: "$students",
      },
      {
        $project: {
          studentName: {
            $concat: ["$students.firstName", " ", "$students.lastName"],
          },
          _id: "$bookedSlots._id",
          date: "$bookedSlots.date",
          startTime: "$bookedSlots.startTime",
          endTime: "$bookedSlots.endTime",
          status: "$bookedSlots.status",
          totalClasses: "$students.courseduration",
          refNo: "$bookedSlots.refNo",
        },
      },
      {
        $sort: {
          date: 1, // Sort by date in ascending order
          startTime: 1, // Within the same date, sort by startTime in ascending order
        },
      },
      {
        $group: {
          _id: "$refNo",
          slots: {
            $push: {
              _id: "$_id",
              date: "$date",
              startTime: "$startTime",
              endTime: "$endTime",
              status: "$status",
              totalClasses: "$totalClasses",
              studentName: "$studentName",
            },
          },
        },
      },
    ]);

    res.status(200).json({ status: true, lessons: lessons });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE route to remove an instructor by ID for a specific branch
router.delete("/:id", async (req, res) => {
  const { branch, id } = req.params;

  try {
    const instructor = await Instructor.findOneAndDelete({ _id: id });
    if (!instructor) {
      return res.status(200).json({ message: "Instructor not found" });
    }
    res.status(200).json({ message: "Instructor deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const instructor = await Instructor.findOneAndUpdate(
      { _id: id },
      { $set: { status: status } },
      { new: true }
    );

    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }
    res.status(200).json({
      message: "Instructor status updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/update/slots", async (req, res) => {
  const { slots } = req.body;
  try {
    const bulkOperations = slots.map((slot) => ({
      updateOne: {
        filter: {
          // _id: instructorID,
          "bookedSlots._id": new ObjectId(slot._id), // Match the specific bookedSlot by _id
        },
        update: {
          $set: {
            "bookedSlots.$.startTime": slot.startTime,
            "bookedSlots.$.endTime": slot.endTime,
            "bookedSlots.$.date": new Date(slot.date).toISOString(), // Ensure ISO string format
            "bookedSlots.$.status": "Pending",
          },
        },
      },
    }));

    await Instructor.bulkWrite(bulkOperations);
    res.status(200).json({
      message: "Slot Time Updated Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/extend/slots/:id", async (req, res) => {
  const { id } = req.params;
  const { days, price, startTime, selectedDate, refNo, courseTimeDuration } =
    req.body;

  const session = await mongoose.startSession(); // Start a new session
  try {
    if (
      !days ||
      !price ||
      !startTime ||
      !selectedDate ||
      !refNo ||
      !courseTimeDuration
    )
      return res.status(400).json({ message: "Please enter all fields" });

    const instructorDoc = await Instructor.findById(id);
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
    const { endDate, adjustedDuration } = calculateEndDate(selectedDate, days);
    const bookedSlots = [];
    let currentStartDate = new Date(selectedDate);
    for (let i = 0; i < adjustedDuration; i++) {
      if (currentStartDate.getDay() === 0) {
        currentStartDate.setDate(currentStartDate.getDate() + 1);
        continue;
      }
      bookedSlots.push({
        date: new Date(currentStartDate).toISOString(),
        startTime: courseStartTime,
        endTime: courseEndTime,
        refNo: refNo,
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
    session.startTransaction(); // Start a transaction
    await instructorDoc.save({ session });
    const admission = await Admission.findOne({
      referenceNumber: refNo,
    }).session(session);

    admission.courseduration += Number(days);
    admission.totalPayment += Number(price);
    if (admission.remainingPayment === 0) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 4);
      admission.paymentDueDate = currentDate.toISOString();
    }
    admission.remainingPayment += Number(price);

    await admission.save({ session });
    await session.commitTransaction();
    res.status(200).json({
      message: "Slot Time Updated Successfully",
    });
  } catch (error) {
    await session.abortTransaction();

    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
  await session.endSession();
});

module.exports = router;
