import ServiceCategories from "./serviceComponents/ServiceCategories";
import { useNavigate } from 'react-router-dom';
import GenerateReport from "./generateReport/generateReport";
import React from "react";

export default function platformManagerPage(){
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate("/login");
      };
      
    return (
        <>
        <div className="admin-page">
            <div className="admin-header">
            <h1>Platform Manager Page</h1>
            <button 
                onClick={handleLogout} 
                className="logout-button"
            >
                Logout
            </button>
            </div>
        
            <ServiceCategories />
            <GenerateReport />
        
        </div>
        </>
    )
}