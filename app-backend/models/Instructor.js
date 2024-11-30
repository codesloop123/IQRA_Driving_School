// models/Instructor.js
const { BranchSchema } = require("./Branch");
const { VehicleSchema } = require("./Vehicle");
const mongoose = require("mongoose");
const timeSlotSchema = new mongoose.Schema(
  {
    time: { type: String, required: true },
    status: { type: String, enum: ["free", "booked"], default: "free" },
  },
  { _id: false }
);
const InstructorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: Boolean, required: true },
    timeSlots: { type: [timeSlotSchema], required: true },
    branch: {
      type: BranchSchema,
      required: true,
    },
    vehicle: {
      type: VehicleSchema,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Instructor", InstructorSchema);
module.exports.InstructorSchema = InstructorSchema;
