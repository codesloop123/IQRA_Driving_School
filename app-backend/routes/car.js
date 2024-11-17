// routes/car.js

const express = require('express');
const Car = require('../models/Car');
const router = express.Router();

// POST route to add a new car for a specific branch
router.post('/:branch/add', async (req, res) => {
  const { branch } = req.params;
  const { name, number, AutoMan } = req.body;

  if (!name || !number || !AutoMan) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const newCar = new Car({ name, number, AutoMan, branch });
    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET route to fetch all cars for a specific branch
router.get('/:branch', async (req, res) => {
  const { branch } = req.params;

  try {
    const cars = await Car.find({ branch }); // Filter by branch
    res.status(200).json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE route to remove a car by ID for a specific branch
router.delete('/:branch/:id', async (req, res) => {
  const { branch, id } = req.params;

  try {
    const car = await Car.findOneAndDelete({ _id: id, branch });
    if (!car) {
      return res.status(404).json({ msg: 'Car not found' });
    }
    res.status(200).json({ msg: 'Car deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
