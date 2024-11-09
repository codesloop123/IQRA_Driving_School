import React, { useState, useEffect } from "react";
import "./sadar.css";
import DateFilter from "./datefilter";
import axios from "axios";
import StudentDetailsModal from "./StudentDetailsModal";

const Sixthdash = () => {
  const branch = "sixth";

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const loadFromLocalStorage = () => {
      const storedStudents = localStorage.getItem("sadarStudents");
      if (storedStudents) {
        const parsedStudents = JSON.parse(storedStudents);
        setStudents(parsedStudents);
        setFilteredStudents(parsedStudents);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `http://62.72.57.154:5000/api/admissions/${branch}`
        );
        setStudents(response.data);
        setFilteredStudents(response.data);
        localStorage.setItem("sadarStudents", JSON.stringify(response.data)); // Save to local storage
      } catch (error) {
        console.error("Error fetching students:", error);
        alert("Failed to fetch Students. Loading data from local storage.");
        loadFromLocalStorage(); // Load from local storage if API fails
      }
    };

    // Check internet connection and decide to fetch from API or local storage
    if (navigator.onLine) {
      fetchStudents();
    } else {
      loadFromLocalStorage();
    }
  }, [branch]);

  const filterStudentsByDate = (startDate, endDate) => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const filtered = students.filter((student) => {
      const studentDate = new Date(student.createdAt);
      return (!start || studentDate >= start) && (!end || studentDate <= end);
    });

    setFilteredStudents(filtered);
  };

  const handleRowClick = (student) => {
    setSelectedStudent(student);
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="sadar-dashboard">
      <div className="sadar-header">
        <h1 className="sadar-heading">Sadar Dashboard</h1>
      </div>

      <div className="sadar-content">
        <h3 className="sadar-title">
          <b>STUDENT DETAILS</b>
        </h3>

        <DateFilter onFilter={filterStudentsByDate} />

        <table className="student-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Ref No.</th>
              <th>Date Registered</th>
              <th>Balance</th>
              <th>Phone Number</th>
              <th>Payment Type</th> {/* New column for Payment Type */}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={index} onClick={() => handleRowClick(student)}>
                <td>{`${student.firstName} ${student.fatherName}`}</td>
                <td>{student.referenceNumber}</td>
                <td>{new Date(student.dateRegistered).toLocaleDateString()}</td>
                <td>{student.remainingAmount}</td>
                <td>{student.cellNumber}</td>
                <td>{student.paymentDetails.paymentType}</td>{" "}
                {/* Display Payment Type */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Sixthdash;
