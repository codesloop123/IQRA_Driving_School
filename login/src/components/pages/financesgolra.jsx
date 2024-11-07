import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './finances.css';
import DateFilter from './datefilter';

const FinancesGolra = () => {
  const branch = 'golra'; // Define the branch name here
  const [finances, setFinances] = useState([]);
  const [filteredFinances, setFilteredFinances] = useState([]);

  useEffect(() => {
    const loadFromLocalStorage = () => {
      const storedFinances = localStorage.getItem(`finances_${branch}`);
      if (storedFinances) {
        const parsedFinances = JSON.parse(storedFinances);
        setFinances(parsedFinances);
        setFilteredFinances(parsedFinances);
      }
    };

    const fetchFinances = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/admissions/${branch}/finances`);
        setFinances(response.data);
        setFilteredFinances(response.data);
        localStorage.setItem(`finances_${branch}`, JSON.stringify(response.data)); // Save to local storage
      } catch (error) {
        console.error('Error fetching financial data:', error);
        loadFromLocalStorage(); // Load from local storage if API fails
      }
    };

    // Check internet connection and decide to fetch from API or local storage
    if (navigator.onLine) {
      fetchFinances();
    } else {
      loadFromLocalStorage();
    }
  }, [branch]);

  // Calculate total paid and balance
  const totalPaid = filteredFinances.reduce((sum, item) => sum + item.paymentDetails.amountReceived, 0);
  const totalBalance = filteredFinances.reduce((sum, item) => sum + item.remainingAmount, 0);

  // Handle printing the page
  const handlePrint = () => {
    window.print();
  };

  // Filter the finances data based on date range
  const filterFinances = (startDate, endDate) => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const filtered = finances.filter((finance) => {
      const financeDate = new Date(finance.createdAt); // Assuming the date is stored in `createdAt`
      return (!start || financeDate >= start) && (!end || financeDate <= end);
    });

    setFilteredFinances(filtered);
  };

  return (
    <div className="finances-container">
      <div className="finances-header">
        <h1>Finances for {branch.charAt(0).toUpperCase() + branch.slice(1)} Branch</h1>
        <div className="finances-buttons">
          <button className="print-button" onClick={handlePrint}>
            Print
          </button>
        </div>
      </div>
      <DateFilter onFilter={filterFinances} />
      <table className="finances-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Ref No.</th>
            <th>Date Registered</th>
            <th>Paid</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {filteredFinances.map((finance, index) => (
            <tr key={index}>
              <td>{`${finance.firstName} ${finance.fatherName}`}</td>
              <td>{finance.referenceNumber}</td>
              <td>{new Date(finance.dateRegistered).toLocaleDateString()}</td>
              <td>{finance.paymentDetails.amountReceived}</td>
              <td>{finance.remainingAmount}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td colSpan="3" className="total-label">Total Amount</td>
            <td>{totalPaid}</td>
            <td>{totalBalance}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FinancesGolra;