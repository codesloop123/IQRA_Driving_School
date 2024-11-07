import React, { useState } from 'react';
import './sidebar.css';
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { MdOutlinePayments } from "react-icons/md";
import { SiGoogleforms } from "react-icons/si";
import { Link, NavLink } from 'react-router-dom';
import { FaBars } from "react-icons/fa";
import iqra from './../Assets/iqra.png';


const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const menuItem = [
    {
      path: "../sidebar/applications",
      name: "Applications",
      icon: <SiGoogleforms />
    },
    {
      path: "../sidebar/dashboard",
      name: "Dashboard",
      icon: <TbLayoutDashboardFilled />
    },
    {
      path: "../sidebar/packages",
      name: "Packages",
      icon: <MdOutlinePayments />
    }
  ];

  return (
    <div className='sidebar-container'>
      <div style={{ width: isOpen ? "200px" : "50px" }} className='side-bar'>
        <div className='top-section'>
        <img src={iqra} alt="Login Logo" className="Logo" />         
          <div className='Bars'>
            <FaBars onClick={toggle} />
          </div>
        </div>
        {menuItem.map((item, index) => (
          <NavLink to={item.path} key={index} className='link' activeClassName='active'>
            <div className='icon'>{item.icon}</div>
            <div style={{ display: isOpen ? "block" : "none" }} className='link_text'>
              {item.name}
            </div>
          </NavLink>
        ))}
      </div>
      <main>{children}</main>
    </div>
  );
}

export default Sidebar;