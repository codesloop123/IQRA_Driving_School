// models/Notification.js
const mongoose = require("mongoose");
const NotificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  status: { type: Boolean, required: true },
  eventDate: {
    type: Date,
    required: true,
  },
  branch: { type: String },
  student: { type: String },
  role: { type: String, required: true },
});

module.exports = mongoose.model("Notification", NotificationSchema);
module.exports.NotificationSchema = NotificationSchema;
