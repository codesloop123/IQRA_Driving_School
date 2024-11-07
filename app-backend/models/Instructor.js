// models/Instructor.js

const mongoose = require('mongoose');

const InstructorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  car: { type: String, required: true },
  branch: { type: String, required: true } // Add branch to the schema
});

module.exports = mongoose.model('Instructor', InstructorSchema);
