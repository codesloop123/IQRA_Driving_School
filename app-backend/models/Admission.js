const { BranchSchema } = require("./Branch");
const mongoose = require("mongoose");
const { InstructorSchema } = require("./Instructor");
const managerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    branch: {
      type: BranchSchema,
      required: true,
    },
  },
  { _id: false }
);
// Schema for the Admission model
const AdmissionSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fatherName: { type: String, required: true },
  cnic: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  cellNumber: { type: String, required: true },
  address: { type: String, required: true },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor",
    required: true,
  },
  vehicle: { type: String, required: true },
  course: { type: String, required: true },
  courseduration: { type: Number, required: true },
  courseTimeDuration: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  paymentMethod: {
    type: String,
    enum: ["Cash", "bank transfer", "easypaisa"],
    required: true,
  },
  totalPayment: { type: Number, required: true },
  paymentReceived: { type: Number, required: true },
  discount: { type: Number },
  remainingPayment: { type: Number, required: true },
  dateRegistered: { type: Date, default: Date.now },
  pickanddrop: { type: Boolean, default: false, required: true },
  pickanddropCharges: { type: Number },
  manager: {
    type: managerSchema,
    required: true,
  },
  dateRegistered: { type: Date, default: Date.now },
  referenceNumber: { type: String, required: true },
  status: { type: Boolean, default: true },
  paymentDueDate: { type: Date },
});

module.exports = mongoose.model("Admission", AdmissionSchema);
