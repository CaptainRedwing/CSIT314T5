import React from "react";

export default function homeownerPage(){

    const handleLogout = () => {
        window.location.href = "/login";
      };

    return (
        <>
        <div>
            <h1>Homeowner Page</h1>

            <button onClick={handleLogout}>Logout</button>
        </div>
        </>
    )
}