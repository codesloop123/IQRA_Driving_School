// models/Instructor.js
const { BranchSchema } = require("./Branch");
const { VehicleSchema } = require("./Vehicle");
const mongoose = require("mongoose");
const InstructorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: Boolean, required: true },
    lecturerCode: { type: String, required: true },
    availability: {
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },

    branch: {
      type: BranchSchema,
      required: true,
    },
    vehicle: {
      type: VehicleSchema,
      required: true,
    },
    bookedSlots: [
      {
        date: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        status: {
          type: String,
          required: true,
          enum: ["Completed", "Missed", "Pending"],
          default: "Pending",
        },
        studentId: {
          type: mongoose.Schema.Types.ObjectId, // Reference to Student document
          ref:"Admission",
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Instructor", InstructorSchema);
module.exports.InstructorSchema = InstructorSchema;
