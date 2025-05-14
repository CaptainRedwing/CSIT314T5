import React from "react";
import FavouriteListing from "./favoriteListingComponents/FavorateSerive"

export default function homeownerPage(){

    const handleLogout = () => {
        window.location.href = "/login";
      };

    return (
        <>
        <div className="admin-page">
        <div className="admin-header">
            <h1>Homeowner Page</h1>
            <button 
            onClick={handleLogout} 
            className="logout-button"
            >
            Logout
            </button>
        </div>
        </div>

        <FavouriteListing />
        </>
    )
}