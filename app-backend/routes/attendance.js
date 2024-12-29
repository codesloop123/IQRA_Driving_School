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
    const mapParse = new Map(attendance.map((item) => [item.id, item.status])); // Check if attendance already exists for this branch and date
    const existingRecord = await Attendance.findOne({ branch, date });
    if (existingRecord) {
      // Update existing attendance record
      existingRecord.attendance = mapParse;
      await existingRecord.save();
    } else {
      // Create new attendance record
      const newAttendance = new Attendance({
        date,
        branch,
        attendance: mapParse, // attendance should be keyed by reference ID
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
    // Find the attendance record for the given branch and date
    const attendees = await Admission.find({
      "manager.branch._id": branchid,
      status: true,
    });
    const parse_to_student = attendees.map((attendee, index) => ({
      id: attendee?._id,
      name: `${attendee?.firstName} ${attendee?.lastName}`,
      refId: attendee?.referenceNumber,
    }));
    console.log(parse_to_student);
    res.status(200).json(parse_to_student);
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
    const attendanceRecord = await Attendance.findOne({ branch, date });

    if (!attendanceRecord) {
      return res
        .status(404)
        .json({ msg: "No attendance found for this date." });
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
