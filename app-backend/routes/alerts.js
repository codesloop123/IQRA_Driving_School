const express = require("express");
const Admission = require("../models/Admission");
const router = express.Router();
const Notification = require("../models/Notification");

// Route to fetch payment alerts for a specific branch
router.get("/payments/:branch", async (req, res) => {
  // const { branch } = req.params;
  const today = new Date();
  try {
    // Fetch admissions with a balance due, where the course is ongoing, and the branch matches
    const admissions = await Admission.find({
      // "instructor.branch._id": { $eq: branch }, // Filter by branch
      remainingPayment: { $gt: 0 },
      // endDate: { $gte: today },
    });
    console.log(admissions);
    res.status(200).json(admissions);
  } catch (error) {
    console.error("Error fetching payment alerts:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Route to mark a payment as complete by updating amountReceived and remainingAmount
router.patch("/complete/:id", async (req, res) => {
  const { id } = req.params;
  const { newAmountReceived, paymentDueDate } = req.body; // New amount received during this payment

  console.log(paymentDueDate);
  if (!paymentDueDate)
    return res.status(400).json({ message: "Due Date Not Entered" });
  try {
    // Find the admission by ID
    const admission = await Admission.findById(id);

    if (!admission) {
      return res.status(404).json({ message: "Admission not found" });
    }

    // Calculate the updated total amount received
    const updatedAmountReceived =
      admission.paymentReceived +
      Math.max(Math.min(admission.totalPayment, Number(newAmountReceived)), 0); //basically keeps the payment in range

    // Calculate the remaining amount after the new payment
    const updatedRemainingAmount =
      admission.totalPayment - updatedAmountReceived;

    // Update the admission with new values
    admission.paymentReceived = updatedAmountReceived;
    admission.remainingPayment =
      updatedRemainingAmount > 0 ? updatedRemainingAmount : 0;
    admission.paymentDueDate = paymentDueDate;

    // Save the updated admission
    const newAdmission = await admission.save();
    if (newAdmission) {
      let message = `Payment ${newAmountReceived} Has Been Added To ${admission?.firstName} ${admission?.lastName}'s Account Successfully.`;
      if (updatedRemainingAmount > 0)
        message += `New Balance is ${updatedRemainingAmount}`;

      const eventDate = new Date();
      const newNotification = new Notification({
        message,
        status: true,
        eventDate,
        branch: null,
        role: "admin",
      });
      await newNotification.save();
      res.status(200).json({
        msg: "Payment completed and balance updated",
        updatedAmountReceived,
        updatedRemainingAmount,
      });
    }
  } catch (error) {
    console.error("Error completing the payment:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
