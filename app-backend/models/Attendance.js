const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  date: { type: String, required: true },
  branch: { type: String, required: true }, // Add branch to schema
  attendance: [
    {
      refId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
        enum: ["Present", "Absent", "Leave"], // Example status types, can be extended
      },
      instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Instructor",
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
