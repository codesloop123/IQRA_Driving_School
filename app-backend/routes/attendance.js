const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// POST route to save attendance for a specific branch and date
router.post('/:branch', async (req, res) => {
  const { branch } = req.params;
  const { date, attendance } = req.body;

  try {
    // Check if attendance already exists for this branch and date
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
        attendance, // attendance should be keyed by reference ID
      });
      await newAttendance.save();
    }
    res.status(201).json({ msg: 'Attendance saved successfully' });
  } catch (error) {
    console.error('Error saving attendance:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET route to fetch attendance for a specific branch and date
router.get('/:branch/:date', async (req, res) => {
  const { branch, date } = req.params;

  try {
    // Find the attendance record for the given branch and date
    const attendanceRecord = await Attendance.findOne({ branch, date });

    if (!attendanceRecord) {
      return res.status(404).json({ msg: 'No attendance found for this date.' });
    }

    res.status(200).json(attendanceRecord);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET route to fetch attendance history by reference ID
router.get('/:branch/history/:referenceId', async (req, res) => {
  const { branch, referenceId } = req.params;

  try {
    const attendanceHistory = await Attendance.find({ branch, [`attendance.${referenceId}`]: { $exists: true } });

    if (!attendanceHistory) {
      return res.status(404).json({ msg: 'No attendance history found for this student.' });
    }

    res.status(200).json(attendanceHistory);
  } catch (error) {
    console.error('Error fetching attendance history:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
