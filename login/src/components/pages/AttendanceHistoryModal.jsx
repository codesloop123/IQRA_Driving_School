import React from 'react';
import './attendanceHistoryModal.css';

const AttendanceHistoryModal = ({ student, attendanceHistory, onClose }) => {
  return (
    <div className="attendance-history-modal">
      <div className="modal-content">
        <h2>{`Attendance History for ${student.firstName} ${student.fatherName}`}</h2>
        {attendanceHistory.length > 0 ? (
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceHistory.map((record, index) => (
                <tr key={index}>
                  <td>{record.date}</td>
                  <td>{record.attendance[student.referenceNumber]}</td> {/* Use referenceNumber as the key */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No attendance history available for this student.</p>
        )}
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
};

export default AttendanceHistoryModal;
