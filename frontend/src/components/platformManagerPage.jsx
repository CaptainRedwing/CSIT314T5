import React from "react";

export default function platformManagerPage(){

    const handleLogout = () => {
        window.location.href = "/login";
      };
      
    return (
        <>
        <div>
            <h1>Platform Manager Page</h1>

            <button onClick={handleLogout}>Logout</button>
        </div>
        </>
    )
}