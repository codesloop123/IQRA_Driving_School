import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './attendance.css';
import AttendanceHistoryModal from './AttendanceHistoryModal';

const AttendanceChak = () => {
  const branch = 'chaklala';

  const [attendance, setAttendance] = useState({});
  const [currentDate, setCurrentDate] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Format date in a URL-safe way (e.g., YYYY-MM-DD)
  useEffect(() => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    setCurrentDate(formattedDate);
  }, []);

  // Load attendance data from local storage or API on page load
  useEffect(() => {
    const loadFromLocalStorage = () => {
      const storedAttendance = localStorage.getItem(`attendance_${branch}_${currentDate}`);
      if (storedAttendance) {
        setAttendance(JSON.parse(storedAttendance));
      }
    };

    const fetchAttendanceForDate = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/attendance/${branch}/${currentDate}`);
        const attendanceData = response.data.attendance || {};
        setAttendance(attendanceData);
        localStorage.setItem(`attendance_${branch}_${currentDate}`, JSON.stringify(attendanceData)); // Save to local storage
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log('No attendance found for today.');
          setAttendance({});
        } else {
          console.error('Error fetching attendance for today:', error);
        }
        loadFromLocalStorage(); // Load from local storage if API fails
      }
    };

    // Check internet connection and decide to fetch from API or local storage
    if (navigator.onLine) {
      fetchAttendanceForDate();
    } else {
      loadFromLocalStorage();
    }
  }, [branch, currentDate]);

  // Fetch students from the API or load from local storage
  useEffect(() => {
    const loadStudentsFromLocalStorage = () => {
      const storedStudents = localStorage.getItem(`students_${branch}`);
      if (storedStudents) {
        setStudents(JSON.parse(storedStudents));
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/admissions/${branch}`);
        setStudents(response.data);
        localStorage.setItem(`students_${branch}`, JSON.stringify(response.data)); // Save to local storage
      } catch (error) {
        console.error('Error fetching student data:', error);
        alert('Failed to fetch students. Loading data from local storage.');
        loadStudentsFromLocalStorage();
      }
    };

    // Check internet connection and decide to fetch from API or local storage
    if (navigator.onLine) {
      fetchStudents();
    } else {
      loadStudentsFromLocalStorage();
    }
  }, [branch]);

  // Handle student click to fetch attendance history
  const handleStudentClick = async (student) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/attendance/${branch}/history/${student.referenceNumber}`);
      setAttendanceHistory(response.data);
      setSelectedStudent(student);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching attendance history:', error);
      alert('Failed to fetch attendance history. Please try again.');
    }
  };

  // Close the attendance history modal
  const handleCloseModal = () => {
    setShowModal(false);
    setAttendanceHistory([]);
  };

  // Update attendance state using reference ID
  const handleClick = (status, referenceNumber) => {
    setAttendance(prevState => ({
      ...prevState,
      [referenceNumber]: status,
    }));
  };

  // Save attendance data (to server and/or local storage)
  const handleSave = async () => {
    const attendanceData = {
      date: currentDate,
      attendance,
    };

    if (navigator.onLine) {
      try {
        await axios.post(`http://localhost:5000/api/attendance/${branch}`, attendanceData);
        alert('Attendance data saved successfully!');
        localStorage.setItem(`attendance_${branch}_${currentDate}`, JSON.stringify(attendanceData));
        localStorage.removeItem(`unsynced_attendance_${branch}_${currentDate}`); // Clear unsynced data if saved online
      } catch (error) {
        console.error('Error saving attendance data:', error);
        alert('Failed to save attendance. Data will be saved locally.');
        localStorage.setItem(`unsynced_attendance_${branch}_${currentDate}`, JSON.stringify(attendanceData));
      }
    } else {
      // Save to local storage if offline
      localStorage.setItem(`unsynced_attendance_${branch}_${currentDate}`, JSON.stringify(attendanceData));
      alert('No internet connection. Attendance saved locally and will be synced when online.');
    }
  };

  // Sync unsynced attendance data when coming online
  useEffect(() => {
    const syncUnsyncedData = async () => {
      const unsyncedData = localStorage.getItem(`unsynced_attendance_${branch}_${currentDate}`);
      if (unsyncedData) {
        try {
          const parsedData = JSON.parse(unsyncedData);
          await axios.post(`http://localhost:5000/api/attendance/${branch}`, parsedData);
          alert('Unsynced attendance data successfully synced with the server!');
          localStorage.removeItem(`unsynced_attendance_${branch}_${currentDate}`);
        } catch (error) {
          console.error('Error syncing unsynced attendance data:', error);
        }
      }
    };

    window.addEventListener('online', syncUnsyncedData);
    return () => {
      window.removeEventListener('online', syncUnsyncedData);
    };
  }, [branch, currentDate]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <h1>Attendance</h1>
      </div>
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>{currentDate}</th>
          </tr>
          <tr>
            <th>Reference Number</th>
            <th>Student Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td>{student.referenceNumber}</td>
              <td onClick={() => handleStudentClick(student)} className="student-name">
                {`${student.firstName} ${student.fatherName}`}
              </td>
              <td>
                <button
                  className={`attendance-button absent ${attendance[student.referenceNumber] === 'ABSENT' ? 'marked' : ''}`}
                  onClick={() => handleClick('ABSENT', student.referenceNumber)}
                >
                  ABSENT
                </button>
                <button
                  className={`attendance-button present ${attendance[student.referenceNumber] === 'PRESENT' ? 'marked' : ''}`}
                  onClick={() => handleClick('PRESENT', student.referenceNumber)}
                >
                  PRESENT
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="save-container">
        <button className="save-button" onClick={handleSave}>Save Attendance</button>
        <button className="print-button" onClick={handlePrint}>Print Attendance</button>
      </div>

      {/* Attendance History Modal */}
      {showModal && (
        <AttendanceHistoryModal
          student={selectedStudent}
          attendanceHistory={attendanceHistory}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AttendanceChak;