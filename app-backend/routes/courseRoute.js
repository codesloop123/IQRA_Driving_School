const express = require("express");
const Course = require("../models/Course");
const router = express.Router();

router.post("/add", async (req, res) => {
  const { name, duration, pricelist, vehicle } = req.body;

  if (!name || !duration || pricelist?.length === 0 || !vehicle) {
    return res.status(400).json({ message: "Please Enter Complete Details" });
  }
  const hasNegativeValues = pricelist.some(
    (item) => item.days <= 0 || item.price <= 0
  );
  if (duration <= 0 || hasNegativeValues)
    return res.status(400).json({ message: "Numbers Can Not be less than 1" });
  try {
    const newCourse = new Course({
      name: name,
      duration: duration,
      pricelist: pricelist,
      vehicle: vehicle,
      status: true,
    });
    const savedCourse = await newCourse.save();
    if (savedCourse) {
      res
        .status(200)
        .json({ status: true, message: "Course added successfully" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET route to fetch all instructors for a specific branch
router.get("/fetch", async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ status: true, courses: courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findOneAndDelete({ _id: id });
    console.log(course);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const course = await Course.findOneAndUpdate(
      { _id: id },
      { $set: { status: status } },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: "course not found" });
    }
    res.status(200).json({
      message: "course status updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
