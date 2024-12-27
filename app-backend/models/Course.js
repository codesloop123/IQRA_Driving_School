const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  vehicle: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  pricelist: [
    {
      days: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  status: { type: Boolean, required: true },
});

module.exports = mongoose.model("Course", CourseSchema);
module.exports.CourseSchema = CourseSchema;
