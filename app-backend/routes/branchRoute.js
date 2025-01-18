const express = require("express");
const Branch = require("../models/Branch");
const User = require("../models/User");
const Instructor = require("../models/Instructor");
const Vehicle = require("../models/Vehicle");
const router = express.Router();
const Notification = require("../models/Notification");

// POST route to add a new instructor for a specific branch
router.post("/add_branch", async (req, res) => {
  const { name, branchCode } = req.body;

  if (!name) {
    return res.status(400).json({ msg: "Please enter branch name" });
  }

  if (!branchCode) {
    return res.status(400).json({ msg: "Please enter branch Id" });
  }

  try {
    const newBranch = new Branch({ name, branchCode });
    const savedBranch = await newBranch.save();
    if (savedBranch) {
      const message = `Branch: ${name} Has Been Added Successfully`;
      const eventDate = new Date();
      const newNotification = new Notification({
        message,
        status: true,
        eventDate,
        branch: null,
        role: "admin",
      });
      await newNotification.save();
      res
        .status(200)
        .json({ status: true, message: "Branch added successfully" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET route to fetch all instructors for a specific branch
router.get("/branches", async (req, res) => {
  try {
    const branches = await Branch.find();

    res.status(200).json({ status: true, branches: branches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// DELETE route to remove an instructor by ID for a specific branch
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const instructors = await Instructor.findOne({ "branch._id": id });
    const managers = await User.findOne({ "branch._id": id });
    const vehicles = await Vehicle.findOne({ "branch._id": id });

    if (instructors || managers || vehicles) {
      return res.status(400).json({
        message:
          "Branch cannot be deleted as it has associated instructors, managers, or vehicles.",
      });
    }
    const branch = await Branch.findOneAndDelete({ _id: id });
    if (!branch) {
      return res.status(404).json({ msg: "branch not found" });
    }
    res.status(200).json({ message: "Branch deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
