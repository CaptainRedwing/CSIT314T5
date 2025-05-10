import React, { useState, useEffect } from "react";
import CreateUserAccount from "./adminComponents/createUserAccount"
import UserAccount from "./adminComponents/UserAccount";
import UserProfile from "./adminComponents/userProfile";
import CreateUserProfile from "./adminComponents/createUserProfile";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login', { replace: true });
};


  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Page</h1>
        <button 
          onClick={handleLogout} 
          className="logout-button"
        >
          Logout
        </button>
      </div>

      <div className="side-by-side">
      <CreateUserAccount />
      <CreateUserProfile/>
      </div>


      <UserAccount />
      <UserProfile />

    </div>
  );
}