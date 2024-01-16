import React from 'react';

const Sidebar = () => {
  return (
    <div style={sidebarStyle}>
      <ul style={listStyle}>
        <li style={menuItemStyle}>Dashboard</li>
        <li style={menuItemStyle}>Notifications</li>
        <li style={menuItemStyle}>Air Quality Data</li>
        <li style={menuItemStyle}>Get Range</li>
        <li style={menuItemStyle}>Settings </li>
        <li style={menuItemStyle}>Logout</li>
        
      </ul>
    </div>
  );
};

const sidebarStyle = {
  width: '200px',
  height: '100%',
  backgroundColor: '#2471a3',
  position: 'fixed',
  top: '80px', // Ajustez la hauteur du header
  left: '0',
};

const listStyle = {
  listStyleType: 'none',
  padding: '0',
};

const menuItemStyle = {
  padding: '10px',
  color: 'white',
  cursor: 'pointer',
};

export default Sidebar;
