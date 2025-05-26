import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { profileService } from "../services/api"; // Import authService

function ProfilePage() {
  const [user, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const goToEditProfile = () => {
    navigate("/profile/edit");
  };

  useEffect(() => {
    // Use the profileService.viewprofile function
    profileService
      .viewprofile()
      .then((response) => {
        setProfile(response.data.user);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch profile:", error);
        setLoading(false);
      });
  }, []);

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "var(--primary-dark)",
      padding: "2rem 0",
    },
    wrapper: {
      maxWidth: "48rem",
      margin: "0 auto",
      padding: "0 1rem",
    },
    profileCard: {
      backgroundColor: "var(--primary-light)",
      borderRadius: "var(--card-border-radius)",
      boxShadow: "var(--box-shadow)",
      overflow: "hidden",
    },
    header: {
      background: "var(--secondary-dark)",
      height: "8rem",
    },
    profileContent: {
      position: "relative",
      padding: "0 1.5rem 1.5rem",
    },
    profileImageContainer: {
      position: "absolute",
      top: "-4rem",
      left: "50%",
      transform: "translateX(-50%)",
    },
    profileImage: {
      width: "8rem",
      height: "8rem",
      borderRadius: "50%",
      border: "4px solid var(--primary-light)",
      boxShadow: "var(--box-shadow)",
      objectFit: "cover",
    },
    userInfo: {
      paddingTop: "5rem",
      textAlign: "center",
    },
    userName: {
      fontSize: "1.875rem",
      fontWeight: "bold",
      color: "var(--text-primary)",
      marginBottom: "0.5rem",
    },
    loadingSpinner: {
      width: "2.5rem",
      height: "2.5rem",
      border: `4px solid var(--border-color)`,
      borderTop: `4px solid var(--accent-color)`,
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      margin: "4rem auto",
      display: "block",
    },
    userRole: {
      fontSize: "1.125rem",
      color: "var(--accent-color)",
      fontWeight: "500",
      marginBottom: "1rem",
    },
    emailContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--text-secondary)",
      marginBottom: "1.5rem",
    },
    emailIcon: {
      width: "1.25rem",
      height: "1.25rem",
      marginRight: "0.5rem",
      color: "var(--text-secondary)",
    },
    buttonContainer: {
      display: "flex",
      gap: "1rem",
      justifyContent: "center",
    },
    primaryButton: {
      padding: "0.5rem 1.5rem",
      backgroundColor: "var(--accent-color)",
      color: "var(--text-primary)",
      borderRadius: "var(--button-border-radius)",
      border: "none",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all var(--transition-speed)",
      "&:hover": {
        backgroundColor: "var(--secondary-light)",
      }
    },
    secondaryButton: {
      padding: "0.5rem 1.5rem",
      border: `1px solid var(--border-color)`,
      color: "var(--text-primary)",
      borderRadius: "var(--button-border-radius)",
      backgroundColor: "var(--primary-light)",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all var(--transition-speed)",
      "&:hover": {
        backgroundColor: "var(--secondary-dark)",
      }
    },
    infoSection: {
      marginTop: "1.5rem",
      backgroundColor: "var(--primary-light)",
      borderRadius: "var(--card-border-radius)",
      boxShadow: "var(--box-shadow)",
      padding: "1.5rem",
    },
    sectionTitle: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      color: "var(--text-primary)",
      marginBottom: "1rem",
    },
    infoItem: {
      borderBottom: `1px solid var(--border-color)`,
      paddingBottom: "1rem",
      marginBottom: "1rem",
    },
    infoLabel: {
      display: "block",
      fontSize: "0.875rem",
      fontWeight: "500",
      color: "var(--text-secondary)",
      marginBottom: "0.25rem",
    },
    infoValue: {
      color: "var(--text-primary)",
    },
    statusContainer: {
      display: "inline-flex",
      alignItems: "center",
      padding: "0.25rem 0.75rem",
      borderRadius: "9999px",
      fontSize: "0.875rem",
      fontWeight: "500",
      backgroundColor: "var(--secondary-dark)",
      color: "var(--text-primary)",
    },
    statusDot: {
      width: "0.5rem",
      height: "0.5rem",
      backgroundColor: "var(--accent-color)",
      borderRadius: "50%",
      marginRight: "0.5rem",
    },
  };

  // Add keyframes for spinner animation
  const spinnerStyle = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;

  if (loading)
    return (
      <>
        <style>{spinnerStyle}</style>
        <div style={styles.loadingSpinner}></div>
      </>
    );

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Profile Card */}
        <div style={styles.profileCard}>
          {/* Header Section */}
          <div style={styles.header}></div>

          {/* Profile Content */}
          <div style={styles.profileContent}>
            {/* Profile Picture */}
            <div style={styles.profileImageContainer}>
              <img
                src={user?.profilePicture || "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"}
                alt={`${user?.name || 'User'}'s profile`}
                style={styles.profileImage}
              />
            </div>

            {/* User Information */}
            <div style={styles.userInfo}>
              <h1 style={styles.userName}>{user?.name || 'User'}</h1>
              <p style={styles.userRole}>{user?.role || 'User'}</p>
              <div style={styles.emailContainer}>
                <svg
                  style={styles.emailIcon}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {user?.email || 'No email available'}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={styles.buttonContainer}>
              <button
                style={styles.primaryButton}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#2563eb")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#3b82f6")
                }
                onClick={goToEditProfile}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div style={styles.infoSection}>
          <h2 style={styles.sectionTitle}>Profile Information</h2>

          <div>
            <div style={styles.infoItem}>
              <label style={styles.infoLabel}>Full Name</label>
              <p style={styles.infoValue}>{user?.name || 'User'}</p>
            </div>

            <div style={styles.infoItem}>
              <label style={styles.infoLabel}>Email Address</label>
              <p style={styles.infoValue}>{user?.email || 'No email available'}</p>
            </div>

            <div style={styles.infoItem}>
              <label style={styles.infoLabel}>Role</label>
              <p style={styles.infoValue}>{user?.role || 'User'}</p>
            </div>

            <div>
              <label style={styles.infoLabel}>Status</label>
              <span style={styles.statusContainer}>
                <span style={styles.statusDot}></span>
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
