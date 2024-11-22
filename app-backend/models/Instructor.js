// models/Instructor.js
const { BranchSchema } = require("./Branch");
const { VehicleSchema } = require("./Vehicle");
const mongoose = require("mongoose");

const InstructorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: Boolean, required: true },
  branch: {
    type: BranchSchema,
    required: true,
  },
  vehicle: {
    type: VehicleSchema,
    required: true,
  },
});

module.exports = mongoose.model("Instructor", InstructorSchema);
