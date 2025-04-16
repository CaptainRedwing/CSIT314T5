import React from "react";

export default function adminProfilePage(){

    const handleLogout = () => {
        window.location.href = "/login";
      };

    return (
        <>
        <div>
            <h1>Admin Profile Page</h1>

            <button onClick={handleLogout}>Logout</button>
        </div>
        </>
    )
}