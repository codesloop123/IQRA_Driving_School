const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Admission = require("../models/Admission");
const Instructor = require("../models/Instructor");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// POST route to save attendance for a specific branch and date
const saveToInstructor = async (savedAttendance, date, session) => {
  const { attendance } = savedAttendance;

  const formattedDate = new Date(date);

  const instructorIds = [
    ...new Set(attendance.map((entry) => entry.instructor)),
  ];
  const instructors = await Instructor.find({
    _id: { $in: instructorIds },
  }).session(session);

  for (const instructor of instructors) {
    for (const entry of attendance) {
      if (instructor._id.toString() === entry.instructor.toString()) {
        instructor.bookedSlots = instructor.bookedSlots.map((slot) => {
          if (
            slot.refNo === entry.refId &&
            slot.date === formattedDate.toISOString()
          ) {
            return {
              ...slot,
              status: entry.status === "Present" ? "Completed" : "Missed",
            };
          }
          return slot;
        });
      }
    }
    await instructor.save({ session });
  }
  await session.commitTransaction();
  session.endSession();
};
router.post("/:branch", async (req, res) => {
  const { branch } = req.params;
  const { date, attendance } = req.body;
  if (!attendance.every((obj) => obj.status !== undefined)) {
    res.status(400).json({ message: "Kindly mark the attendance completely." });
    return;
  } else if (!date) {
    res.status(400).json({ message: "Set the date" });
    return;
  }

  const session = await mongoose.startSession(); // Start a new session
  session.startTransaction(); // Start a transaction
  try {
    const filteredattendance = attendance.map((entry) => ({
      refId: entry.refId,
      status: entry.status,
      name: entry.name,
      instructor: new mongoose.Types.ObjectId(entry.instructorId),
    }));
    const existingRecord = await Attendance.findOne({ branch, date });
    if (existingRecord) {
      // Update existing attendance record
      existingRecord.attendance = filteredattendance;
      const savedAttendance = await existingRecord.save({ session });
      saveToInstructor(savedAttendance, date, session);
    } else {
      // Create new attendance record
      const newAttendance = new Attendance({
        date,
        branch,
        attendance: filteredattendance, // attendance should be keyed by reference ID
      });

      const savedAttendance = await newAttendance.save({ session });
      saveToInstructor(savedAttendance, date, session);
    }
    res.status(201).json({ msg: "Attendance saved successfully" });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error saving attendance:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/students/:branchid/:date", async (req, res) => {
  const { branchid, date } = req.params;
  console.log(branchid, date);
  async function getStudentDetailsForDateAndBranch(date, branchId) {
    try {
      const results = await Instructor.aggregate([
        {
          $match: {
            "branch._id": new ObjectId(branchId), // Filter instructors by branch ID
          },
        },
        {
          $unwind: "$bookedSlots", // Decompose bookedSlots into individual documents
        },
        {
          $match: {
            "bookedSlots.date": new Date(date).toISOString(), // Match only booked slots with the specified date
          },
        },
        {
          $lookup: {
            from: "admissions", // Collection name for students
            localField: "bookedSlots.refNo", // Reference field in bookedSlots
            foreignField: "referenceNumber", // Field in Admission collection to match
            as: "matchedStudents", // Resulting array of matching students
          },
        },
        {
          $unwind: "$matchedStudents", // Decompose matched students into individual documents
        },
        {
          $project: {
            _id: 0, // Exclude instructor ID
            _id: "$matchedStudents._id", // Include student ID
            name: {
              $concat: [
                "$matchedStudents.firstName",
                " ",
                "$matchedStudents.lastName",
              ],
            },
            refId: "$bookedSlots.refNo", // Include slot date
            instructorName: "$name",
            instructorId: "$_id",
          },
        },
      ]);

      return results;
    } catch (error) {
      console.error("Error fetching student details:", error);
      throw error;
    }
  }
  try {
    const attendees = await getStudentDetailsForDateAndBranch(date, branchid);
    res.status(200).json(attendees);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/:branch/:date", async (req, res) => {
  const { branch, date } = req.params;

  console.log(branch, date, "1");
  try {
    // Find the attendance record for the given branch and date
    const attendanceRecord = await Attendance.aggregate([
      {
        $match: {
          branch: branch,
          date: date, // Filter by branch and date
        },
      },
      {
        $unwind: "$attendance", // Deconstruct the attendance array
      },
      {
        $lookup: {
          from: "admissions", // The name of the Admission collection (lowercase and pluralized by default)
          localField: "attendance.refId", // Field in Attendance to match
          foreignField: "referenceNumber", // Field in Admission to match
          as: "admissionDetails", // Alias for joined data
        },
      },
      {
        $unwind: "$admissionDetails", // Deconstruct the admissionDetails array
      },
      {
        $project: {
          _id: 1, // Exclude _id
          firstName: "$admissionDetails.firstName",
          lastName: "$admissionDetails.lastName",
          refId: "$admissionDetails.referenceNumber",
          status: "$admissionDetails.status", // Status from Attendance
          presence: "$attendance.status",
        },
      },
    ]);
    if (!attendanceRecord) {
      return res
        .status(404)
        .json({ message: "No attendance found for this date." });
    }

    res.status(200).json(attendanceRecord);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET route to fetch attendance history by reference ID
router.get("/:branch/history/:referenceId", async (req, res) => {
  const { branch, referenceId } = req.params;

  try {
    const attendanceHistory = await Attendance.find({
      branch,
      [`attendance.${referenceId}`]: { $exists: true },
    });

    if (!attendanceHistory) {
      return res
        .status(404)
        .json({ msg: "No attendance history found for this student." });
    }

    res.status(200).json(attendanceHistory);
  } catch (error) {
    console.error("Error fetching attendance history:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
