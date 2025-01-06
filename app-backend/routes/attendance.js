const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Admission = require("../models/Admission");
// POST route to save attendance for a specific branch and date

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
  try {
    const existingRecord = await Attendance.findOne({ branch, date });
    if (existingRecord) {
      // Update existing attendance record
      existingRecord.attendance = attendance;
      await existingRecord.save();
    } else {
      // Create new attendance record
      const newAttendance = new Attendance({
        date,
        branch,
        attendance: attendance, // attendance should be keyed by reference ID
      });
      await newAttendance.save();
    }
    res.status(201).json({ msg: "Attendance saved successfully" });
  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/students/:branchid", async (req, res) => {
  const { branchid } = req.params;

  try {
    const attendees = await Admission.find(
      {
        "manager.branch._id": branchid,
        status: true,
      },
      {
        _id: 1, // Include _id
        firstName: 1, // Include firstName
        lastName: 1, // Include lastName
        referenceNumber: 1, // Include referenceNumber
      }
    ).lean();
    const formattedAttendees = attendees.map((attendee) => ({
      _id: attendee._id,
      name: `${attendee.firstName} ${attendee.lastName}`,
      refId: attendee.referenceNumber,
    }));
    res.status(200).json(formattedAttendees);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET route to fetch attendance for a specific branch and date
router.get("/:branch/:date", async (req, res) => {
  const { branch, date } = req.params;

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
