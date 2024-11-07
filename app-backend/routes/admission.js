const express = require('express');
const mongoose = require('mongoose'); 
const Admission = require('../models/Admission');
const router = express.Router();
// function to generate reference number
const generateReferenceNumber = async (branchCode, lecturerCode) => {
  const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
  const currentYear = new Date().getFullYear().toString().slice(-2); // Get last two digits of the year

  // Set the start and end date for the current month
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  // Find the count of admissions for the current month
  const admissionCount = await Admission.countDocuments({
    dateRegistered: {
      $gte: startOfMonth,
      $lt: endOfMonth,
    },
  });

  // Increment the count and pad the number with 2 digits (e.g., 01, 02)
  const entryOfMonth = (admissionCount + 1).toString().padStart(2, '0');

  // Generate the reference number in the format MM-EntryNumber-LecturerCode-BranchCode-YY
  return `${currentMonth.toString().padStart(2, '0')}-${entryOfMonth}-${lecturerCode}-${branchCode}-${currentYear}`;
};


router.post('/:branch/submit', async (req, res) => {
  const { branch } = req.params;
  const {
    firstName,
    fatherName,
    cnicNumber,
    gender,
    dateOfBirth,
    cellNumber,
    address,
    vehicle,
    course,
    paymentDetails,
    remainingAmount,
    branchCode, 
    lecturerCode,
    instructor,
    dateRegistered = new Date(),
    courseDuration, 
    timeSlots,

  } = req.body;

  try {
    const referenceNumber = await generateReferenceNumber(branchCode, lecturerCode);
    const courseEndDate = new Date(dateRegistered);
    courseEndDate.setDate(courseEndDate.getDate() + courseDuration);

    const admission = new Admission({
      firstName,
      fatherName,
      cnicNumber,
      gender,
      dateOfBirth,
      cellNumber,
      address,
      vehicle,
      course,
      paymentDetails,
      remainingAmount,
      referenceNumber,
      instructor,
      timeSlots,
      dateRegistered,
      courseEndDate,
      branch, // Save branch information
      courseDuration, 
      admissionId: new mongoose.Types.ObjectId().toString(),
    });

    await admission.save();
    res.status(201).json({ msg: 'Admission submitted successfully', referenceNumber });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET route to fetch all admissions for a specific branch
router.get('/:branch', async (req, res) => {
  const { branch } = req.params;

  try {
    const admissions = await Admission.find({ branch });
    res.status(200).json(admissions);
  } catch (error) {
    console.error('Error fetching admissions:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT route to toggle student's active status
router.put('/:branch/:id/status', async (req, res) => {
  const { branch, id } = req.params;
  const { isActive } = req.body;  // New status from the frontend

  try {
    const admission = await Admission.findOne({ _id: id, branch });

    if (!admission) {
      return res.status(404).json({ msg: 'Admission not found' });
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
    res.status(200).json({ msg: 'Student status updated successfully', isActive: admission.isActive });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/:branch/finances', async (req, res) => {
  const { branch } = req.params;

  try {
    // Fetch admissions with payment details for the specific branch
    const admissions = await Admission.find({ branch });

    // You can customize this to return only relevant financial data
    const finances = admissions.map(admission => ({
      firstName: admission.firstName,
      fatherName: admission.fatherName,
      referenceNumber: admission.referenceNumber,
      dateRegistered: admission.dateRegistered,
      paymentDetails: admission.paymentDetails,
      remainingAmount: admission.remainingAmount
    }));

    res.status(200).json(finances);
  } catch (error) {
    console.error('Error fetching finances:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});
// Route to fetch instructors for a specific branch
router.get('/instructors/:branch', async (req, res) => {
  const { branch } = req.params;
  
  try {
    const instructors = await Instructor.find({ branch });
    if (!instructors) {
      return res.status(404).json({ msg: 'No instructors found for this branch.' });
    }
    res.status(200).json(instructors);
  } catch (error) {
    console.error('Error fetching instructors:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Route to fetch admissions by instructor and branch
router.get('/:branch/instructor/:instructorName', async (req, res) => {
  const { branch, instructorName } = req.params;

  try {
    // Find admissions for the specific branch and instructor
    const admissions = await Admission.find({ branch, instructor: instructorName });

    if (!admissions || admissions.length === 0) {
      // If no admissions found, send an empty array with a 200 status
      return res.status(200).json([]);
    }

    // If admissions are found, return them
    res.status(200).json(admissions);
  } catch (error) {
    console.error('Error fetching admissions:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});
router.put('/:branch/:admissionId', async (req, res) => {
  const { branch, admissionId } = req.params;
  const { timeSlots } = req.body;

  if (!timeSlots || !Array.isArray(timeSlots)) {
    return res.status(400).json({ msg: 'Invalid or missing timeSlots' });
  }

  try {
    // Find the admission document by branch and admissionId
    const admission = await Admission.findOne({ admissionId, branch });

    if (!admission) {
      return res.status(404).json({ msg: 'Admission not found' });
    }

    // Replace all existing time slots for this admissionId with new ones
    admission.timeSlots = timeSlots.map((slot) => ({
      admissionId: admissionId,
      start: new Date(slot.start),
      end: new Date(slot.end),
      title: slot.title || '',
    }));

    // Save the updated admission document
    const updatedAdmission = await admission.save();
    res.status(200).json({ msg: 'Events updated successfully', updatedAdmission });
  } catch (error) {
    console.error('Error updating admission:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Route to get booked slots for an instructor in a specific branch
router.get('/:branch/:instructorId/slots', async (req, res) => {
  const { branch, instructorId } = req.params;

  try {
    // Find admissions by instructor and branch with their booked time slots
    const admissions = await Admission.find({
      branch,
      'instructor': instructorId
    });

    // Extract all time slots from admissions
    const bookedSlots = admissions.flatMap(admission => admission.timeSlots);

    res.status(200).json(bookedSlots);
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
