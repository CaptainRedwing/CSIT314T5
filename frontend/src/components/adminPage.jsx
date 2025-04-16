import React from "react";

export default function adminPage({user, onLogout}){
    return (
        <>
        <div>
            <h1>Admin Page</h1>

            <button onclick={onLogout}>Logout</button>
        </div>
        </>
    )
}