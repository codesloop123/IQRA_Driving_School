// src/components/pages/Invoice.jsx
import React from 'react';

const Invoice = ({ data }) => {
  const {
    firstName,
    fatherName,
    vehicle,
    course,
    instructor, // Make sure this receives the instructor's name
    paymentDetails,
    remainingAmount,
    referenceNumber,
    submissionDate,
  } = data;

  // Ensure that `instructor` is a string (name), or use a fallback
  const instructorName = typeof instructor === 'string' ? instructor : instructor?.name || 'N/A';

  const handlePrint = () => {
    window.print(); // Use browser's print functionality
  };

  return (
    <div className="invoice-container">
      <h2>Invoice</h2>
      <p><strong>Reference Number:</strong> {referenceNumber}</p>
      <p><strong>Date:</strong> {submissionDate}</p>
      <p><strong>Student Name:</strong> {firstName} {fatherName}</p>
      <p><strong>Vehicle:</strong> {vehicle}</p>
      <p><strong>Course:</strong> {course}</p>
      <p><strong>Instructor:</strong> {instructorName}</p> {/* Show the instructor name */}
      <p><strong>Total Payment:</strong> {paymentDetails.totalAmount}</p>
      <p><strong>Amount Received:</strong> {paymentDetails.amountReceived}</p>
      <p><strong>Remaining Amount:</strong> {remainingAmount}</p>

      <button className="print-button" onClick={handlePrint}>Print Invoice</button>
    </div>
  );
};

export default Invoice;
