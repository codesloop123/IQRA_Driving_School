const express = require('express');
const Admission = require('../models/Admission');
const router = express.Router();

// Route to fetch payment alerts for a specific branch
router.get('/payments/:branch', async (req, res) => {
  const { branch } = req.params;
  const today = new Date();

  try {
    // Fetch admissions with a balance due, where the course is ongoing, and the branch matches
    const admissions = await Admission.find({
      branch, // Filter by branch
      remainingAmount: { $gt: 0 },
      courseEndDate: { $gte: today }
    });

    res.status(200).json(admissions);
  } catch (error) {
    console.error('Error fetching payment alerts:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Route to mark a payment as complete by updating amountReceived and remainingAmount
router.post('/complete/:id', async (req, res) => {
  const { id } = req.params;
  const { newAmountReceived } = req.body; // New amount received during this payment

  try {
    // Find the admission by ID
    const admission = await Admission.findById(id);

    if (!admission) {
      return res.status(404).json({ msg: 'Admission not found' });
    }

    console.log(`New amount received: ${newAmountReceived}`);
    console.log(`Previous amount received: ${admission.amountReceived}`);

    // Calculate the updated total amount received
    const updatedAmountReceived = admission.amountReceived + newAmountReceived;

    // Calculate the remaining amount after the new payment
    const updatedRemainingAmount = admission.totalAmount - updatedAmountReceived;

    // Log the calculated values to check them
    console.log(`Updated total amount received: ${updatedAmountReceived}`);
    console.log(`Updated remaining amount: ${updatedRemainingAmount}`);

    // Update the admission with new values
    admission.amountReceived = updatedAmountReceived;
    admission.remainingAmount = updatedRemainingAmount > 0 ? updatedRemainingAmount : 0;

    // Save the updated admission
    await admission.save();

    res.status(200).json({ 
      msg: 'Payment completed and balance updated', 
      updatedAmountReceived, 
      updatedRemainingAmount 
    });
  } catch (error) {
    console.error('Error completing the payment:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
