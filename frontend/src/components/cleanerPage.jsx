import React from "react";
import ServiceListing from "./serviceListingComponents/ServiceListing";
import { useNavigate } from 'react-router-dom';

export default function cleanerPage(){

    const navigate = useNavigate();

    const handleLogout = () => {
        navigate("/login");
      };

    return (
        <>
        <div className="admin-page">
            <div className="admin-header">
                <h1>Cleaner Page</h1>

                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
        </div>
        <ServiceListing />
        </>
    )
}