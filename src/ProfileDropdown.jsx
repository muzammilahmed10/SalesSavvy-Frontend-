import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useravatar from "./useravatar.png";
import "./assets/styles.css";
import Profile from "./Profile";

export function ProfileDropdown({ username }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false); // ✅ Profile overlay state
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:9090/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        console.log("User successfully logged out");
        navigate("/");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleOrdersClick = () => {
    navigate("/orders");
  };

  return (
    <>
      <div className="profile-dropdown">
        <button className="profile-button" onClick={toggleDropdown}>
          <img
            src={useravatar}
            alt="User Avatar"
            className="user-avatar"
            onError={(e) => {
              e.target.src = "fallback-logo.png";
            }}
          />
          <span className="username">{username || "Guest"}</span>
        </button>

        {isOpen && (
          <div className="dropdown-menu">
            <button
              className="dropdown-item block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                setShowProfile(true); // ✅ Opens Profile overlay
                setIsOpen(false); // Close dropdown
              }}
            >
              Profile
            </button>
            <a onClick={handleOrdersClick}>Orders</a>
            <button className="profile-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>

      {/* ✅ Profile Overlay (Independent of Header) */}
      {showProfile && <Profile isOpen={showProfile} onClose={() => setShowProfile(false)} username={username} />}
    </>
  );
}
