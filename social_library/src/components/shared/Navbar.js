// src/components/shared/Navbar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    marginLeft: '20px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    transition: 'color 0.3s ease',
  };

  const activeLinkStyle = {
    color: '#ffcc00', // Highlight color for the active link
  };

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      backgroundColor: '#333',
      color: '#fff',
      minHeight: '100px' // Double the height compared to a standard navbar
    }}>
      {/* Left: Logo */}
      <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
        <NavLink to="/" style={{ color: '#fff', textDecoration: 'none' }}>
          Social Lib
        </NavLink>
      </div>

      {/* Right: Navigation Links */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <NavLink 
          to="/books"
          style={({ isActive }) => 
            isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle
          }
        >
          Books
        </NavLink>
        {user && (
          <>
            <NavLink 
              to="/myaccount"
              style={({ isActive }) => 
                isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle
              }
            >
              My Account
            </NavLink>
           
            <NavLink 
              to="/community"
              style={({ isActive }) => 
                isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle
              }
            >
              Community
            </NavLink>
          </>
        )}
        {user ? (
          <button 
            onClick={handleLogout}
            style={{
              marginLeft: '20px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              transition: 'color 0.3s ease'
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <NavLink 
              to="/login"
              style={({ isActive }) => 
                isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle
              }
            >
              Login
            </NavLink>
            <NavLink 
              to="/register"
              style={({ isActive }) => 
                isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle
              }
            >
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

