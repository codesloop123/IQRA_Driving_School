// routes/instructor.js

const express = require("express");
const Instructor = require("../models/Instructor");
const router = express.Router();

// POST route to add a new instructor for a specific branch
router.post("/add", async (req, res) => {
  const { name, email, branch, vehicle, status, timeSlots } = req.body;

  if (
    !name ||
    !email ||
    !branch ||
    !vehicle ||
    !status ||
    timeSlots?.length < 0
  ) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    let instructor = await Instructor.findOne({ email });
    if (instructor) {
      return res.status(200).json({ message: "Instructor already exists" });
    }
    const newInstructor = new Instructor({
      name,
      email,
      branch,
      vehicle,
      timeSlots,
      status,
    });
    const savedInstructor = await newInstructor.save();
    if (savedInstructor) {
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
router.get("/fetch", async (req, res) => {
  try {
    const instructors = await Instructor.find();
    res.status(200).json({ status: true, instructors: instructors });
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

module.exports = router;
