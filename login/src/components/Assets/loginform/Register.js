import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import logo from './iqra.png'; // Ensure your logo path is correct

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('manager'); // Default to manager
  const [branch, setBranch] = useState('Sadar Manager'); // Default branch for managers
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // State for loading indicator
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading indicator while processing

    // Validate the input data
    if (!name || !email || !password || (role === 'manager' && !branch)) {
      setMessage('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        role,
        branch: role === 'manager' ? branch : '', // Branch is required only for managers
      });

      if (response.status === 201) {
        setMessage('Registration successful');
        setTimeout(() => {
          navigate('/'); // Redirect to login page after 2 seconds
        }, 2000);
      } else {
        setMessage('Registration failed');
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.msg || 'Registration failed');
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <div className="container">
      <form className="register-form" onSubmit={handleRegister}>
        <img src={logo} alt="logo" style={{ width: '400px', height: '300px' }} />
        <h2>Register</h2>
        <div className="input-group">
          <i className="fa fa-user"></i>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <i className="fa fa-envelope"></i>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <i className="fa fa-lock"></i>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <i className="fa fa-user"></i>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        {role === 'manager' && (
          <div className="input-group">
            <i className="fa fa-building"></i>
            <select value={branch} onChange={(e) => setBranch(e.target.value)} required>
              <option value="Sadar Manager">Sadar Manager</option>
              <option value="Golra Manager">Golra Manager</option>
              <option value="G10 Manager">G10 Manager</option>
              <option value="Melody Manager">Melody Manager</option>
              <option value="Sixth-road Manager">Sixth-road Manager</option>
              <option value="Chaklala Manager">Chaklala Manager</option>
              <option value="Alipur Manager">Alipur Manager</option>
            </select>
          </div>
        )}
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'REGISTER'}
        </button>
        <div className="message">{message}</div>
        <div className="signup-link">
          Already have an account? <Link to="/">Login here!</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
