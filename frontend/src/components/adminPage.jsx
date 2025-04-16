import React from "react";

export default function adminPage(){

    const handleLogout = () => {
        window.location.href = "/login";
      };


    return (
        <>
        <div>
            <h1>Admin Page</h1>

            <button onClick={handleLogout}>Logout</button>
        </div>
        </>
    )
}