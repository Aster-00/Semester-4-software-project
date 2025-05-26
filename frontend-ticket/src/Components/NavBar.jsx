import React, { useState, useEffect } from "react";
import { FaSearch, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const styles = {
  navContainer: {
    width: "100%",
    background: "var(--primary-dark)",
    padding: "1.2rem 0",
    display: "flex",
    justifyContent: "center",
  },
  navBar: {
    width: "97%",
    maxWidth: "1700px",
    background: "var(--primary-light)",
    borderRadius: "var(--card-border-radius)",
    boxShadow: "var(--box-shadow)",
    display: "flex",
    alignItems: "center",
    padding: "0.5rem 2.5rem",
    gap: "2rem",
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: "bold",
    fontSize: "2rem",
    marginRight: "2.5rem",
    letterSpacing: "0.5px",
    color: "var(--text-primary)",
    textDecoration: "none",
  },
  searchContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    background: "var(--secondary-dark)",
    borderRadius: "2rem",
    padding: "0.5rem 1.5rem",
    maxWidth: "420px",
    margin: "0 auto",
  },
  searchIcon: {
    fontSize: "1.2rem",
    color: "var(--text-secondary)",
    marginRight: "0.75rem",
  },
  searchInput: {
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "1rem",
    width: "100%",
    color: "var(--text-primary)",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
    marginLeft: "2rem",
  },
  link: {
    fontSize: "1.1rem",
    color: "var(--text-primary)",
    textDecoration: "none",
    fontWeight: 500,
    transition: "color var(--transition-speed)",
    cursor: "pointer",
    "&:hover": {
      color: "var(--accent-color)",
    }
  },
  icon: {
    fontSize: "1.6rem",
    color: "var(--text-primary)",
    marginLeft: "1.5rem",
    cursor: "pointer",
    transition: "color var(--transition-speed)",
    "&:hover": {
      color: "var(--accent-color)",
    }
  },
};

const NavBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  console.log('NavBar component is rendering...');

  // Check for user data and role in localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const isAuthenticated = user !== null;
  const isOrganizer = user?.role === 'Organizer';
  const isAdmin = user?.role === 'Admin';

  console.log('Direct check - User role:', user?.role, 'isAdmin:', isAdmin);

  // Temporary debugging - remove after fixing
  React.useEffect(() => {
    console.log('=== NavBar Debug Info ===');
    console.log('Raw userString from localStorage:', userString);
    console.log('Parsed user object:', user);
    console.log('User role:', user?.role);
    console.log('User role type:', typeof user?.role);
    console.log('isAuthenticated:', isAuthenticated);
    console.log('isOrganizer (role === "Organizer"):', isOrganizer);
    console.log('isAdmin (role === "Admin"):', isAdmin);
    console.log('========================');
  }, [userString, user?.role]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      e.preventDefault();
      console.log('Navigating to events with search query:', searchQuery);
      navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <div style={styles.navContainer}>
      <nav style={styles.navBar}>
        <Link to="/" style={styles.logo}>A7gzly</Link>
        <div style={styles.searchContainer}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search for events..."
            style={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
        <div style={styles.navLinks}>
          <Link to="/events" style={styles.link}>Events</Link>
          {/* Show My Bookings link for authenticated users */}
          {isAuthenticated && (
            <Link to="/my-bookings" style={styles.link}>My Bookings</Link>
          )}
          {/* Show My Events link for organizers */}
          {isOrganizer && (
            <Link to="/my-events" style={styles.link}>My Events</Link>
          )}
          {/* Show Admin link for admin users */}
          {isAdmin && (
            <Link to="/admin" style={styles.link}>Admin</Link>
          )}
          {/* Conditionally render Login/Profile and Logout */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaUser
                style={styles.icon}
                title="Profile"
                onClick={() => navigate("/profile")}
                tabIndex={0}
                role="button"
                aria-label="Go to profile"
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate("/profile"); }}
              />
              <FaSignOutAlt
                style={styles.icon}
                title="Logout"
                onClick={handleLogout}
                tabIndex={0}
                role="button"
                aria-label="Logout"
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleLogout(); }}
              />
            </div>
          ) : (
            <Link to="/login" style={styles.link}>Login</Link>
          )}
          {/* Register button for non-authenticated users */}
          {!isAuthenticated && (
            <Link to="/register" style={styles.link}>Register</Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
