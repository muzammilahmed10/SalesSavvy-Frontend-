import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";

const Profile = ({ isOpen, onClose, username }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const modalRef = useRef(null); // Reference for modal

  useEffect(() => {
    if (isOpen && username) {
      fetch(`http://localhost:9090/api/profile/${username}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch profile: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setUser(data);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          setError("Failed to load profile. Please try again.");
        });
    }
  }, [isOpen, username]);

  // ✅ Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Close the modal
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="profile-overlay">
      <div className="profile-modal" ref={modalRef}>
        <h2>User Profile</h2>
        {error ? (
          <p className="error-text">{error}</p>
        ) : user ? (
          <div className="profile-content">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Profile;
