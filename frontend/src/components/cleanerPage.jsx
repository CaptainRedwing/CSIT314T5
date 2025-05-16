import React from "react";
import ServiceListing from "./serviceListingComponents/ServiceListing";

export default function cleanerPage(){

    const handleLogout = () => {
        window.location.href = "/login";
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