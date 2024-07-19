import React, { useEffect, useState } from "react";
import "../../styles/layouts/Sidebar.css";

const SidebarItem = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  };

  return (
    <div className="sidebar-item">
      <div className="sidebar-item-title" onClick={toggleExpand}>
        {title}
      </div>
      <div className={`sidebar-sub-items ${isExpanded ? "expanded" : ""}`}>
        {children}
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      <div className="sidebar-desktop">
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
          <button className="close-btn" onClick={toggleSidebar}>
            &times;
          </button>
          <h2>Adim Page</h2>
          <ul>
            <SidebarItem title="Manage Accounts">
              <li>Account Info</li>
              <li>Reset Password</li>
            </SidebarItem>
            <SidebarItem title="Manage Projects">
              <li>Project Info</li>
              <li>Assign Employees</li>
              <li>Project Tracking</li>
            </SidebarItem>
            <SidebarItem title="Technology">
              <li>Technology Info</li>
            </SidebarItem>
            <SidebarItem title="Employee">
              <li>Employee Profile</li>
              <li>Assign Project</li>
            </SidebarItem>
            <SidebarItem title="Languages">
              <li>Programming Language Info</li>
            </SidebarItem>
            <SidebarItem title="CV"></SidebarItem>
            <SidebarItem title="Log out"></SidebarItem>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
