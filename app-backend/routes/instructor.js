// routes/instructor.js

const express = require('express');
const Instructor = require('../models/Instructor');
const router = express.Router();

// POST route to add a new instructor for a specific branch
router.post('/:branch/add', async (req, res) => {
  const { branch } = req.params;
  const { name, id, car } = req.body;

  if (!name || !id || !car) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const newInstructor = new Instructor({ name, id, car, branch });
    const savedInstructor = await newInstructor.save();
    res.status(201).json(savedInstructor);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ msg: 'Instructor ID already exists' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET route to fetch all instructors for a specific branch
router.get('/:branch', async (req, res) => {
  const { branch } = req.params;

  try {
    const instructors = await Instructor.find({ branch });
    res.status(200).json(instructors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE route to remove an instructor by ID for a specific branch
router.delete('/:branch/:id', async (req, res) => {
  const { branch, id } = req.params;

  try {
    const instructor = await Instructor.findOneAndDelete({ _id: id, branch });
    if (!instructor) {
      return res.status(404).json({ msg: 'Instructor not found' });
    }
    res.status(200).json({ msg: 'Instructor deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
