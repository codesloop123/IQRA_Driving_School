import React from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="header-line">
        <span className="header-title">Dashboard</span>
      </div>
      <h2>IQRA Driving School Management System</h2>
      <div className="dashboard-welcome">
        Welcome Back Admin User
      </div>
      <div className="dashboard-cards">
        <Link to="/sidebarmanag/sadardash" style={{ textDecoration: 'none' }}>
          <div className="card card-sadar">
            <p>SADAR</p>
          </div>
        </Link>
        <Link to="/sidebargolra/golradash" style={{ textDecoration: 'none' }}>
          <div className="card card-golra">
            <p>GOLRA</p>
          </div>
        </Link>
        <Link to="/sidebarg10/g10dash" style={{ textDecoration: 'none' }}>
          <div className="card card-g10">
            <p>G-10</p>
          </div>
        </Link>
        <Link to="/sidebarmel/melodydash" style={{ textDecoration: 'none' }}>
          <div className="card card-melody">
            <p>MELODY</p>
          </div>
        </Link>
        <Link to="/sidebar6/sixthdash" style={{ textDecoration: 'none' }}>
          <div className="card card-sixthroad">
            <p>Sixth-Road <br />(6TH-ROAD)</p>
          </div>
        </Link>
        <Link to="/sidebarchak/chaklaladash" style={{ textDecoration: 'none' }}>
          <div className="card card-chaklala">
            <p>Chaklala</p>
          </div>
        </Link>
        <Link to="/sidebarali/alipurdash" style={{ textDecoration: 'none' }}>
          <div className="card card-alipur">
            <p>Ali Pur</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
