const mongoose = require('mongoose');

// Schema for the Admission model
const AdmissionSchema = new mongoose.Schema({
  admissionId: { type: String, required: true, unique: true },
  timeSlots: [
    {
      title: { type: String, required: true }, // Ensure title is required if important
      start: { type: Date, required: true },   // Ensure start date is required
      end: { type: Date, required: true },     // Ensure end date is required
    }
  ],
  firstName: { type: String, required: true },
  fatherName: { type: String, required: true },
  cnicNumber: { type: String, required: true },
  gender: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  cellNumber: { type: String, required: true },
  address: { type: String, required: true },
  vehicle: { type: String, required: true },
  course: { type: String, required: true },
  courseDuration: { type: Number, required: true },
 
  paymentDetails: {
    totalAmount: { type: Number, required: true },
    amountReceived: { type: Number, required: true },
    installment: { type: Boolean, required: true },
    paymentType: { type: String, enum: ['cash', 'bank transfer', 'easypaisa'], required: true }, 
  },
  remainingAmount: { type: Number, required: true }, 
  referenceNumber: { type: String, required: true }, 
  dateRegistered: { type: Date, default: Date.now }, 
  courseEndDate: { type: Date, required: true }, 
  instructor: { type: String }, 
  branch: { type: String, required: true },
  isActive: { type: Boolean, default: true }, 
  pausedAt: { type: Date, default: null },     
});

module.exports = mongoose.model('Admission', AdmissionSchema);
