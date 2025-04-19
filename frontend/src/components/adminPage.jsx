import React, { useState, useEffect } from "react";
import Create from "./adminComponents/createUser";
import Search from "./adminComponents/searchUser";

export default function AdminPage() {

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Page</h1>
        <button 
          onClick={() => (window.location.href = "/login")} 
          className="logout-button"
        >
          Logout
        </button>
      </div>

      <Create />

      <Search />
    </div>
  );
}