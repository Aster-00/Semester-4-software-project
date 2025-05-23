import React, { useState, useEffect } from "react";
import { FaSearch, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";

const styles = {
  navContainer: {
    width: "100%",
    background: "linear-gradient(90deg,rgb(9, 109, 248) 0%,rgb(153, 0, 255) 100%)",
    padding: "1.2rem 0",
    display: "flex",
    justifyContent: "center",
  },
  navBar: {
    width: "97%",
    maxWidth: "1700px",
    background: "#fff",
    borderRadius: "2.5rem",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
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
  },
  searchContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    background: "#f5f5f5",
    borderRadius: "2rem",
    padding: "0.5rem 1.5rem",
    maxWidth: "420px",
    margin: "0 auto",
  },
  searchIcon: {
    fontSize: "1.2rem",
    color: "#222",
    marginRight: "0.75rem",
  },
  searchInput: {
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "1rem",
    width: "100%",
    color: "#444",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
    marginLeft: "2rem",
  },
  link: {
    fontSize: "1.1rem",
    color: "#222",
    textDecoration: "none",
    fontWeight: 500,
    transition: "color 0.2s",
    cursor: "pointer",
  },
  icon: {
    fontSize: "1.6rem",
    color: "#222",
    marginLeft: "1.5rem",
    cursor: "pointer",
  },
  userMenu: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  userActions: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  logoutButton: {
    background: "none",
    border: "none",
    padding: "0",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    color: "#222",
    fontSize: "1.6rem",
  }
};

const NavBar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for user in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      // Clear user from localStorage
      localStorage.removeItem("user");
      setUser(null);
      // Redirect to events page
      navigate("/events");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div style={styles.navContainer}>
      <nav style={styles.navBar}>
        <span style={styles.logo} onClick={() => navigate("/")} role="button" tabIndex={0}>A7gzly</span>
        <div style={styles.searchContainer}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search for events..."
            style={styles.searchInput}
          />
        </div>
        <div style={styles.navLinks}>
          <a href="/events" style={styles.link}>Events</a>
          <a href="/support" style={styles.link}>Contact & Support</a>
          <div style={styles.userActions}>
            {user ? (
              <>
                <FaUser
                  style={styles.icon}
                  title="Profile"
                  onClick={() => navigate("/profile")}
                  tabIndex={0}
                  role="button"
                  aria-label="Go to profile"
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate("/profile"); }}
                />
                <button
                  style={styles.logoutButton}
                  onClick={handleLogout}
                  title="Logout"
                  aria-label="Logout"
                >
                  <FaSignOutAlt />
                </button>
              </>
            ) : (
              <FaUser
                style={styles.icon}
                title="Login"
                onClick={() => navigate("/login")}
                tabIndex={0}
                role="button"
                aria-label="Go to login"
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate("/login"); }}
              />
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
