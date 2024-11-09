import React, { useState, useEffect } from "react";
import axios from "axios";
import "./carsdetail.css";

const CarsDetailsGolra = () => {
  const [cars, setCars] = useState([]);
  const [newCar, setNewCar] = useState({ name: "", number: "", AutoMan: "" });
  const branch = "golra";

  useEffect(() => {
    const loadFromLocalStorage = () => {
      const storedCars = localStorage.getItem(`cars_${branch}`);
      if (storedCars) setCars(JSON.parse(storedCars));
    };

    const fetchCars = async () => {
      try {
        const response = await axios.get(
          `http://62.72.57.154:5000/api/cars/${branch}`
        );
        setCars(response.data);
        localStorage.setItem(`cars_${branch}`, JSON.stringify(response.data)); // Save to local storage
      } catch (error) {
        console.error("Error fetching cars:", error);
        alert("Failed to fetch cars. Loading data from local storage.");
        loadFromLocalStorage(); // Load from local storage if API fails
      }
    };

    // Check internet connection and decide to fetch from API or local storage
    if (navigator.onLine) {
      fetchCars();
    } else {
      loadFromLocalStorage();
    }
  }, [branch]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCar((prev) => ({ ...prev, [name]: value }));
  };

  // Add new car to the list and database
  const addCar = async () => {
    if (newCar.name && newCar.number && newCar.AutoMan) {
      if (navigator.onLine) {
        try {
          const response = await axios.post(
            `http://62.72.57.154:5000/api/cars/${branch}/add`,
            newCar
          );
          if (response.status === 201) {
            const updatedCars = [...cars, response.data];
            setCars(updatedCars);
            localStorage.setItem(`cars_${branch}`, JSON.stringify(updatedCars)); // Update local storage
            setNewCar({ name: "", number: "", AutoMan: "" });
          }
        } catch (error) {
          console.error("Error adding car:", error);
          alert("Failed to add car. Please try again.");
        }
      } else {
        // Save new car to local storage if offline
        const unsyncedCars =
          JSON.parse(localStorage.getItem(`unsynced_cars_${branch}`)) || [];
        unsyncedCars.push(newCar);
        localStorage.setItem(
          `unsynced_cars_${branch}`,
          JSON.stringify(unsyncedCars)
        );

        const updatedCars = [...cars, newCar];
        setCars(updatedCars);
        localStorage.setItem(`cars_${branch}`, JSON.stringify(updatedCars)); // Update local storage

        alert("Car added offline and will be synced when online.");
        setNewCar({ name: "", number: "", AutoMan: "" });
      }
    } else {
      alert("Please fill in all fields before adding a new car.");
    }
  };

  // Sync unsynced cars when coming online
  useEffect(() => {
    const syncUnsyncedCars = async () => {
      const unsyncedCars =
        JSON.parse(localStorage.getItem(`unsynced_cars_${branch}`)) || [];
      if (unsyncedCars.length > 0) {
        for (const car of unsyncedCars) {
          try {
            await axios.post(
              `http://62.72.57.154:5000/api/cars/${branch}/add`,
              car
            );
            console.log(`Car ${car.name} synced successfully.`);
          } catch (error) {
            console.error(`Error syncing car ${car.name}:`, error);
          }
        }
        localStorage.removeItem(`unsynced_cars_${branch}`);
        alert("Unsynced cars have been successfully synced with the server.");
      }
    };

    window.addEventListener("online", syncUnsyncedCars);
    return () => {
      window.removeEventListener("online", syncUnsyncedCars);
    };
  }, [branch]);

  // Delete a car from the list and the database
  const deleteCar = async (id) => {
    try {
      await axios.delete(`http://62.72.57.154:5000/api/cars/${branch}/${id}`);
      const updatedCars = cars.filter((car) => car._id !== id);
      setCars(updatedCars);
      localStorage.setItem(`cars_${branch}`, JSON.stringify(updatedCars)); // Update local storage
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("Failed to delete car. Please try again.");
    }
  };

  return (
    <div className="car-details-container">
      <div className="car-details-header">
        <h1>Saddar Branch Car Details</h1>
      </div>
      <table className="car-details-table">
        <thead>
          <tr>
            <th>Car Name</th>
            <th>Car Number</th>
            <th>Auto/Manual</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car._id}>
              <td>{car.name}</td>
              <td>{car.number}</td>
              <td>{car.AutoMan}</td>
              <td>
                <button
                  className="delete-button"
                  onClick={() => deleteCar(car._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="add-car-form">
        <input
          type="text"
          name="name"
          placeholder="Car Name"
          value={newCar.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="number"
          placeholder="Car Number"
          value={newCar.number}
          onChange={handleChange}
        />
        <input
          type="text"
          name="AutoMan"
          placeholder="Auto/Manual"
          value={newCar.AutoMan}
          onChange={handleChange}
        />
        <button className="add-button" onClick={addCar}>
          Add new Car
        </button>
      </div>
    </div>
  );
};

export default CarsDetailsGolra;
