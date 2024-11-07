import React, { useState, useRef, useEffect } from 'react';
import './sidebarmanag.css';
import { TbLayoutDashboardFilled } from "react-icons/tb"; // Dashboard icon
import { MdOutlinePayments } from "react-icons/md"; // Icon for Payments/Attendance
import { SiGoogleforms } from "react-icons/si"; // Icon for Admissions
import { MdOutlineNotificationsActive } from "react-icons/md"; // Icon for Alerts
import { NavLink } from 'react-router-dom';
import { FaBars } from "react-icons/fa";
import { FaMoneyBillWave, FaCar, FaUserTie } from "react-icons/fa"; // Icons for Finances, Cars Detail, and Instructor Details
import { AiOutlineCalendar } from "react-icons/ai"; // Icon for Scheduling
import iqra from './../Assets/iqra.png';

const Sidebarmanag = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Close sidebar when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    {
      path: "admissions",
      name: "Admissions",
      icon: <SiGoogleforms />
    },
    {
      path: "dashboard",
      name: "Dashboard",
      icon: <TbLayoutDashboardFilled />
    },
    {
      path: "attendance",
      name: "Attendance",
      icon: <MdOutlinePayments />
    },
    {
      path: "alertssadar",
      name: "Alerts",
      icon: <MdOutlineNotificationsActive />
    },
    {
      path: "financessadar",
      name: "Finances",
      icon: <FaMoneyBillWave /> // Finances icon
    },
    {
      path: "carsdetail",
      name: "CarsDetail",
      icon: <FaCar /> // Cars Detail icon
    },
    {
      path: "instructorsadar",
      name: "Instructor Details",
      icon: <FaUserTie /> // Instructor Details icon
    },
    {
      path: "schedule",
      name: "Scheduling",
      icon: <AiOutlineCalendar /> // Scheduling icon
    }
  ];

  return (
    <div className='sidebar-manag-wrapper'>
      <div ref={sidebarRef} className={`sidebar-manag ${isOpen ? 'open' : ''}`}>
        <div className='sidebar-manag-header'>
          <img src={iqra} alt="Logo" className="sidebar-manag-logo" />
          <div className='sidebar-manag-toggle-button'>
            <FaBars onClick={toggleSidebar} />
          </div>
        </div>
        {menuItems.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className={({ isActive }) => isActive ? 'sidebar-manag-nav-link active' : 'sidebar-manag-nav-link'}
          >
            <div className='sidebar-manag-icon'>{item.icon}</div>
            <div className={`sidebar-manag-link-text ${isOpen ? 'show' : 'hide'}`}>
              {item.name}
            </div>
          </NavLink>
        ))}
      </div>
      <div className='sidebar-manag-main-content'>
        {children}
      </div>
    </div>
  );
}

export default Sidebarmanag;
