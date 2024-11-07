import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import logo from './iqra.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      if (response.status === 200 && response.data) {
        setMessage('Login successful');

        // Extract role and branch from the response
        const { role, branch } = response.data.user;

        // Determine the route based on role and branch
        if (role === 'admin') {
          navigate('/sidebar'); // Navigate to admin dashboard
        } else if (role === 'manager') {
          // Navigate to a specific manager's dashboard
          switch (branch) {
            case 'Sadar Manager':
              navigate('/sidebarmanag/sadar-dashboard');
              break;
            case 'Golra Manager':
              navigate('/sidebargolra/golra-dashboard');
              break;
            case 'G10 Manager':
              navigate('/sidebarg10/g10-dashboard');
              break;
            case 'Melody Manager':
              navigate('/sidebarmel/melody-dashboard');
              break;
            case 'Sixth-road Manager':
              navigate('/sidebar6/sixth-dashboard');
              break;
            case 'Chaklala Manager':
              navigate('/sidebarchak/chaklala-dashboard');
              break;
            case 'Alipur Manager':
              navigate('/sidebarali/alipur-dashboard');
              break;
            default:
              setMessage('Unknown manager branch');
          }
        } else {
          setMessage('Unknown role');
        }
      } else {
        setMessage('Login failed');
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="container">
      <form className="login-form" onSubmit={handleLogin}>
        <img src={logo} alt="logo" style={{ width: '400px', height: '300px' }} />
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
        <div className="options">
          <label>
            <input type="checkbox" />
            Remember me?
          </label>
          <Link to="/forgot-password" className="forgot-password">
            Forgot Password?
          </Link>
        </div>
        <button className="btn-primary" type="submit">
          LOGIN
        </button>
        <div className="message">{message}</div>
        <div className="signup-link">
          Don't have an account? <Link to="/register">Sign up here!</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
