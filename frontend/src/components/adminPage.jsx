import React, { useState, useEffect } from "react";
import Create from "./adminComponents/createUser";
import Search from "./adminComponents/searchUser";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login', { replace: true });
};

  const userProfilePage = () => {
     navigate('/userProfile', {replace: true});
  }


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

      <Create />
      <div>
        <button
          onClick={userProfilePage}
          className="create-button"
        >
          View ProfileType
        </button>
      </div>

      <Search />
    </div>
  );
}