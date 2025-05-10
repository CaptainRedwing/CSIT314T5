import ServiceCategories from "./serviceComponents/ServiceCategories";

export default function platformManagerPage(){

    const handleLogout = () => {
        window.location.href = "/login";
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
        
        </div>
        </>
    )
}