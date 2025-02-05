// routes/car.js

const express = require("express");
const Vehicle = require("../models/Vehicle");
const router = express.Router();
const Notification = require("../models/Notification");
// POST route to add a new car for a specific branch
router.post("/add_vehicle", async (req, res) => {
  const { name, number, type, branch } = req.body;

  if (!name || !number || !type || !branch) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const newVehicle = new Vehicle({ name, number, type, branch });
    const savedVehicle = await newVehicle.save();
    if (savedVehicle) {
      const message = `Vehicle: ${name} Has Been Added Successfully`;
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
        .json({ status: true, message: "Vehicle added successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/get_vehicles", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json({ status: true, vehicles: vehicles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// DELETE route to remove a car by ID for a specific branch
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const vehicle = await Vehicle.findOneAndDelete({ _id: id });
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
