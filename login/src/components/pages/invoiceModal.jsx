import React from 'react';
import './invoiceModal.css'; // Add custom styles for modal

const InvoiceModal = ({ data, onClose }) => {
  const {
    firstName,
    fatherName,
    vehicle,
    course,
    instructor,
    paymentDetails,
    remainingAmount,
    referenceNumber,
    submissionDate,
  } = data;

  const instructorName = typeof instructor === 'string' ? instructor : instructor?.name || 'N/A';

  const handlePrint = () => {
    window.print(); // Use browser's print functionality
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Invoice</h2>
        <p><strong>Reference Number:</strong> {referenceNumber}</p>
        <p><strong>Date:</strong> {submissionDate}</p>
        <p><strong>Student Name:</strong> {firstName} {fatherName}</p>
        <p><strong>Vehicle:</strong> {vehicle}</p>
        <p><strong>Course:</strong> {course}</p>
        <p><strong>Instructor:</strong> {instructorName}</p>
        <p><strong>Total Payment:</strong> {paymentDetails.totalAmount}</p>
        <p><strong>Remaining Amount:</strong> {remainingAmount}</p>

        <button className="print-button" onClick={handlePrint}>Print Invoice</button>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default InvoiceModal;
