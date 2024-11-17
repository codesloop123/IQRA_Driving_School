
// models/Car.js

const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
  AutoMan: { type: String, required: true },
  branch: { type: String, required: true } // Field to store the branch name
});

module.exports = mongoose.model('Car', CarSchema);

