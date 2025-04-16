import React from "react";

export default function cleanerPage(){

    const handleLogout = () => {
        window.location.href = "/login";
      };

    return (
        <>
        <div>
            <h1>Cleaner Page</h1>

            <button onClick={handleLogout}>Logout</button>
        </div>
        </>
    )
}