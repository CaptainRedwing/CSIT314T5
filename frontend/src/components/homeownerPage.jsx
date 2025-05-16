import React from "react";
import FavouriteListing from "./favoriteListingComponents/FavorateSerive"
import HomeownerMatchHistory from "./matchHistory/homeownerMatchHistory";
import { useNavigate } from 'react-router-dom';

export default function homeownerPage(){
    const navigate = useNavigate();


    const handleLogout = () => {
        navigate("/login");
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