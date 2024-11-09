import React, { useState, useEffect } from "react";
import "./sadar.css";
import DateFilter from "./datefilter";
import axios from "axios";
import StudentDetailsModal from "./StudentDetailsModal"; // Import the modal

const Chaklaladash = () => {
  const branch = "chaklala"; // Define the branch name

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null); // State to store selected student

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Include the branch in the request URL to fetch branch-specific data
        const response = await axios.get(
          `http://62.72.57.154:5000/api/admissions/${branch}`
        );
        setStudents(response.data);
        setFilteredStudents(response.data); // Set default filtered students to all students
      } catch (error) {
        console.error("Error fetching students:", error);
        alert("Failed to fetch Students. Please try again.");
      }
    };

    fetchStudents();
  }, [branch]);

  // Function to filter students based on date range
  const filterStudentsByDate = (startDate, endDate) => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const filtered = students.filter((student) => {
      const studentDate = new Date(student.createdAt);
      return (!start || studentDate >= start) && (!end || studentDate <= end);
    });

    setFilteredStudents(filtered);
  };

  // Function to handle row click
  const handleRowClick = (student) => {
    setSelectedStudent(student); // Set the clicked student as selected
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setSelectedStudent(null); // Deselect the student to close the modal
  };

  return (
    <div className="sadar-dashboard">
      {/* Header */}
      <div className="sadar-header">
        <h1 className="sadar-heading">Chaklala Dashboard</h1>
      </div>

      {/* Student Details */}
      <div className="sadar-content">
        <h3 className="sadar-title">
          <b>STUDENT DETAILS</b>
        </h3>

        {/* Date Range Filters */}
        <DateFilter onFilter={filterStudentsByDate} />

        {/* Student Details Table */}
        <table className="student-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Ref No.</th>
              <th>Date Registered</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={index} onClick={() => handleRowClick(student)}>
                {" "}
                {/* Row click handler */}
                <td>{`${student.firstName} ${student.fatherName}`}</td>
                <td>{student.referenceNumber}</td>
                <td>{new Date(student.dateRegistered).toLocaleDateString()}</td>
                <td>{student.paymentDetails.amountReceived}</td>
                <td>{student.remainingAmount}</td>
                <td>{student.cellNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for displaying selected student details */}
      {selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Chaklaladash;
