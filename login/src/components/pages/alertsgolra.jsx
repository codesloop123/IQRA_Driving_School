import React, { useState, useEffect } from "react";
import axios from "axios";
import "./alerts.css";
import InvoiceModal from "./invoiceModal"; // Import the InvoiceModal component

const AlertsGolra = () => {
  const branch = "golra"; // Specify the branch name here
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null); // For displaying the invoice in a modal
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [newAmountReceived, setNewAmountReceived] = useState(0); // To handle the new amount being received

  useEffect(() => {
    const loadFromLocalStorage = () => {
      const storedAlerts = localStorage.getItem(`alerts_${branch}`);
      if (storedAlerts) {
        setAlerts(JSON.parse(storedAlerts));
      }
    };

    const fetchAlerts = async () => {
      try {
        const response = await axios.get(
          `http://62.72.57.154:5000/api/alerts/payments/${branch}`
        );
        setAlerts(response.data);
        localStorage.setItem(`alerts_${branch}`, JSON.stringify(response.data)); // Save to local storage
      } catch (err) {
        setError(
          "Error fetching payment alerts. Loading data from local storage."
        );
        console.error(err);
        loadFromLocalStorage(); // Load from local storage if API fails
      }
    };

    // Check internet connection and decide to fetch from API or local storage
    if (navigator.onLine) {
      fetchAlerts();
    } else {
      loadFromLocalStorage();
    }
  }, [branch]);

  const handleComplete = (alert) => {
    if (alert.remainingAmount > 0) {
      // Generate the invoice data based on the alert details
      const invoiceData = {
        firstName: alert.firstName,
        fatherName: alert.fatherName,
        vehicle: alert.vehicle,
        course: alert.course,
        instructor: alert.instructor,
        paymentDetails: {
          totalAmount: alert.totalAmount,
          amountReceived: alert.amountReceived,
        },
        remainingAmount: alert.remainingAmount,
        referenceNumber: alert.referenceNumber,
        submissionDate: new Date().toLocaleDateString(),
      };

      // Show the invoice modal
      setInvoiceData(invoiceData);
      setShowModal(true);
    }
  };

  const handleCloseModal = async (alertId) => {
    setShowModal(false);

    const updatedAlerts = alerts.map((alert) => {
      if (alert._id === alertId) {
        return { ...alert, remainingAmount: 0 }; // Mark as completed locally
      }
      return alert;
    });

    setAlerts(updatedAlerts);
    localStorage.setItem(`alerts_${branch}`, JSON.stringify(updatedAlerts)); // Update local storage

    if (navigator.onLine) {
      try {
        // Send the new amount received to the backend
        await axios.post(
          `http://62.72.57.154:5000/api/alerts/complete/${alertId}`,
          {
            newAmountReceived: newAmountReceived,
          }
        );
        // Remove the alert from displayed list if the balance is cleared
        setAlerts(alerts.filter((alert) => alert._id !== alertId));
        localStorage.setItem(
          `alerts_${branch}`,
          JSON.stringify(alerts.filter((alert) => alert._id !== alertId))
        );
      } catch (err) {
        console.error("Error completing the payment:", err);
        alert(
          "Error completing payment. The update has been saved locally and will sync when online."
        );
      }
    } else {
      // If offline, mark alert for later sync
      const unsyncedAlerts =
        JSON.parse(localStorage.getItem(`unsynced_alerts_${branch}`)) || [];
      unsyncedAlerts.push({ alertId, newAmountReceived });
      localStorage.setItem(
        `unsynced_alerts_${branch}`,
        JSON.stringify(unsyncedAlerts)
      );
      alert(
        "No internet connection. Payment completion will be synced when online."
      );
    }
  };

  // Sync unsynced alerts when coming online
  useEffect(() => {
    const syncUnsyncedData = async () => {
      const unsyncedData =
        JSON.parse(localStorage.getItem(`unsynced_alerts_${branch}`)) || [];
      if (unsyncedData.length > 0) {
        for (const { alertId, newAmountReceived } of unsyncedData) {
          try {
            await axios.post(
              `http://62.72.57.154:5000/api/alerts/complete/${alertId}`,
              { newAmountReceived }
            );
            console.log(`Alert ${alertId} synced successfully.`);
          } catch (error) {
            console.error(`Error syncing alert ${alertId}:`, error);
          }
        }
        localStorage.removeItem(`unsynced_alerts_${branch}`);
        alert(
          "Unsynced payment completions have been successfully synced with the server."
        );
      }
    };

    window.addEventListener("online", syncUnsyncedData);
    return () => {
      window.removeEventListener("online", syncUnsyncedData);
    };
  }, [branch]);

  return (
    <div className="alerts-container">
      <h2>
        Payment Alerts for {branch.charAt(0).toUpperCase() + branch.slice(1)}{" "}
        Branch
      </h2>
      {error && <p className="error-message">{error}</p>}
      {alerts.length > 0 ? (
        <table className="alerts-table">
          <thead>
            <tr>
              <th>Reference ID</th>
              <th>Student Name</th>
              <th>Date of Admission</th>
              <th>Balance Amount</th>
              <th>Course End Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert._id}>
                <td>{alert.referenceNumber}</td>
                <td>
                  {alert.firstName} {alert.fatherName}
                </td>
                <td>{new Date(alert.dateRegistered).toLocaleDateString()}</td>
                <td>{alert.remainingAmount}</td>
                <td>{new Date(alert.courseEndDate).toLocaleDateString()}</td>
                <td>
                  {alert.remainingAmount > 0 ? (
                    <button
                      className="complete-button"
                      onClick={() => handleComplete(alert)}
                    >
                      Complete
                    </button>
                  ) : (
                    "Completed"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No payment alerts at the moment.</p>
      )}

      {/* Render the invoice modal if invoiceData exists */}
      {showModal && invoiceData && (
        <InvoiceModal
          data={invoiceData}
          onClose={() =>
            handleCloseModal(
              alerts.find(
                (alert) => alert.referenceNumber === invoiceData.referenceNumber
              )._id
            )
          }
        />
      )}
    </div>
  );
};

export default AlertsGolra;
