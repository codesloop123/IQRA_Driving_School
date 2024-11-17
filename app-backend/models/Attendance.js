const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  date: { type: String, required: true },
  branch: { type: String, required: true }, // Add branch to schema
  attendance: { type: Map, of: String, required: true }, // Store student names/IDs as keys and attendance status as values
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
