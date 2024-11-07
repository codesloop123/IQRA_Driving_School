import React, { useState } from 'react';

const DateFilter = ({ onFilter }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Handle filtering with the selected dates
  const handleFilter = () => {
    onFilter(startDate, endDate);
  };

  return (
    <div className="filter-section">
      <label>
        Start Date:
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>
      <label>
        End Date:
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </label>
      <button className="filter-button" onClick={handleFilter}>
        Filter
      </button>
    </div>
  );
};

export default DateFilter;