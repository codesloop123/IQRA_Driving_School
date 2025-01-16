// routes/instructor.js

const express = require("express");
const Instructor = require("../models/Instructor");
const router = express.Router();
const Notification = require("../models/Notification");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// POST route to add a new instructor for a specific branch
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
  console.log(id);
  try {
    const instructors = await Instructor.find({
      "branch._id": new ObjectId(id),
    });
    // console.log(instructors);
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
  console.log(students);
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

module.exports = router;
