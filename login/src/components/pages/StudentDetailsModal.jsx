import React from 'react';
import './studentDetailsModal.css'; // Assuming you'll add styles for the modal

const StudentDetailsModal = ({ student, onClose }) => {
  if (!student) return null; // Don't show modal if no student is selected
  console.log(student);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Student Details</h2>
        <button className="close-modal" onClick={onClose}>Close</button>
        
        {/* Display all student details */}
        <p><strong>Reference Number:</strong> {student.referenceNumber}</p>
        <p><strong>First Name:</strong> {student.firstName}</p>
        <p><strong>Father's Name:</strong> {student.fatherName}</p>
        <p><strong>CNIC Number:</strong> {student.cnicNumber}</p>
        <p><strong>Gender:</strong> {student.gender}</p>
        <p><strong>Date of Birth:</strong> {new Date(student.dateOfBirth).toLocaleDateString()}</p>
        <p><strong>Cell Number:</strong> {student.cellNumber}</p>
        <p><strong>Address:</strong> {student.address}</p>
        <p><strong>Vehicle:</strong> {student.vehicle}</p>
        <p><strong>Course:</strong> {student.course}</p>
        <p><strong>Instructor:</strong> {student.instructor}</p>
        <p><strong>Total Payment:</strong> {student.paymentDetails.totalAmount}</p>
        <p><strong>Payment Type:</strong> {student.paymentDetails.paymentType}</p>

       
        <p><strong>Remaining Amount:</strong> {student.remainingAmount}</p>
        <p><strong>Date Registered:</strong> {new Date(student.dateRegistered).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default StudentDetailsModal;
