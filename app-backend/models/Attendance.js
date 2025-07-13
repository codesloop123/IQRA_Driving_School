const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  date: { type: String, required: true },
  branch: { type: String, required: true }, // Add branch to schema
  attendance: [
    {
      admission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admission",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
        enum: ["Present", "Absent", "Leave"],
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
