import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './instructors.css'; 

const Instructorsadar = () => {
  const [instructors, setInstructors] = useState([]);
  const [newInstructor, setNewInstructor] = useState({ name: '', id: '', car: '' });
  const [cars, setCars] = useState([]);
  const branch = 'saddar';

  // Fetch instructors and cars for the specific branch when the component mounts
  useEffect(() => {
    const loadFromLocalStorage = () => {
      const storedInstructors = localStorage.getItem(`instructors_${branch}`);
      const storedCars = localStorage.getItem(`cars_${branch}`);
      if (storedInstructors) setInstructors(JSON.parse(storedInstructors));
      if (storedCars) setCars(JSON.parse(storedCars));
    };

    const fetchInstructors = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/instructors/${branch}`);
        setInstructors(response.data);
        localStorage.setItem(`instructors_${branch}`, JSON.stringify(response.data)); // Save to local storage
      } catch (error) {
        console.error('Error fetching instructors:', error);
        alert('Failed to fetch instructors. Loading data from local storage.');
        loadFromLocalStorage(); // Load from local storage if API fails
      }
    };

    const fetchCars = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cars/${branch}`);
        setCars(response.data);
        localStorage.setItem(`cars_${branch}`, JSON.stringify(response.data)); // Save to local storage
      } catch (error) {
        console.error('Error fetching cars:', error);
        alert('Failed to fetch car options. Loading data from local storage.');
        loadFromLocalStorage(); // Load from local storage if API fails
      }
    };

    // Check internet connection and decide to fetch from API or local storage
    if (navigator.onLine) {
      fetchInstructors();
      fetchCars();
    } else {
      loadFromLocalStorage();
    }
  }, [branch]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewInstructor((prev) => ({ ...prev, [name]: value }));
  };

  // Add new instructor to the list and database
  const addInstructor = async () => {
    if (newInstructor.name && newInstructor.id && newInstructor.car) {
      if (navigator.onLine) {
        try {
          const response = await axios.post(`http://localhost:5000/api/instructors/${branch}/add`, newInstructor);
          if (response.status === 201) {
            const updatedInstructors = [...instructors, response.data];
            setInstructors(updatedInstructors);
            localStorage.setItem(`instructors_${branch}`, JSON.stringify(updatedInstructors)); // Update local storage
            setNewInstructor({ name: '', id: '', car: '' });
          }
        } catch (error) {
          console.error('Error adding instructor:', error);
          alert('Failed to add instructor. Please try again.');
        }
      } else {
        // Save new instructor to local storage if offline
        const unsyncedInstructors = JSON.parse(localStorage.getItem(`unsynced_instructors_${branch}`)) || [];
        unsyncedInstructors.push(newInstructor);
        localStorage.setItem(`unsynced_instructors_${branch}`, JSON.stringify(unsyncedInstructors));
        
        const updatedInstructors = [...instructors, newInstructor];
        setInstructors(updatedInstructors);
        localStorage.setItem(`instructors_${branch}`, JSON.stringify(updatedInstructors)); // Update local storage

        alert('Instructor added offline and will be synced when online.');
        setNewInstructor({ name: '', id: '', car: '' });
      }
    } else {
      alert('Please fill in all fields before adding a new instructor.');
    }
  };

  // Sync unsynced instructors when coming online
  useEffect(() => {
    const syncUnsyncedInstructors = async () => {
      const unsyncedInstructors = JSON.parse(localStorage.getItem(`unsynced_instructors_${branch}`)) || [];
      if (unsyncedInstructors.length > 0) {
        for (const instructor of unsyncedInstructors) {
          try {
            await axios.post(`http://localhost:5000/api/instructors/${branch}/add`, instructor);
            console.log(`Instructor ${instructor.name} synced successfully.`);
          } catch (error) {
            console.error(`Error syncing instructor ${instructor.name}:`, error);
          }
        }
        localStorage.removeItem(`unsynced_instructors_${branch}`);
        alert('Unsynced instructors have been successfully synced with the server.');
      }
    };

    window.addEventListener('online', syncUnsyncedInstructors);
    return () => {
      window.removeEventListener('online', syncUnsyncedInstructors);
    };
  }, [branch]);

  // Delete an instructor from the list and the database
  const deleteInstructor = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/instructors/${branch}/${id}`);
      const updatedInstructors = instructors.filter((instructor) => instructor._id !== id);
      setInstructors(updatedInstructors);
      localStorage.setItem(`instructors_${branch}`, JSON.stringify(updatedInstructors)); // Update local storage
    } catch (error) {
      console.error('Error deleting instructor:', error);
      alert('Failed to delete instructor. Please try again.');
    }
  };

  return (
    <div className="instructor-container">
      <div className="instructor-header">
        <h1>Sadar Branch Instructor Details</h1>
      </div>
      <table className="instructor-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Instructor ID</th>
            <th>Car</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {instructors.map((instructor) => (
            <tr key={instructor._id}>
              <td>{instructor.name}</td>
              <td>{instructor.id}</td>
              <td>{instructor.car}</td>
              <td>
                <button className="delete-button" onClick={() => deleteInstructor(instructor._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="add-instructor-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newInstructor.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="id"
          placeholder="Instructor ID"
          value={newInstructor.id}
          onChange={handleChange}
        />

        {/* Car Selection Dropdown */}
        <select className="dropdown" name="car" value={newInstructor.car} onChange={handleChange} required>
          <option value="">Select Car</option>
          {cars.map((car) => (
            <option key={car._id} value={car.name}>
              {`${car.name} - ${car.AutoMan}`}
            </option>
          ))}
        </select>

        <button className="add-button" onClick={addInstructor}>
          Add new Instructor
        </button>
      </div>
    </div>
  );
};

export default Instructorsadar;
