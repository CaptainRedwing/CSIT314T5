import React, { useState } from "react"
import AdminPage from "./adminPage";
import AdminProfilePage from "./adminProfilePage";
import CleanerPage from "./cleanerPage";
import HomeownerPage from "./homeownerPage";
import PlatformManagerPage from "./platformManagerPage";


export default function login() {

    const [formData, setFormData] = useState({

        useraccount : '',
        password: '',
        accountType : 'UserAdmin'
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const handleChange = (e) => {
        const { name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]:value
        }))
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');
  
      try {
          const response = await fetch('http://localhost:3000/api/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  useraccount: formData.useraccount,
                  password: formData.password,
                  accountType: formData.accountType
              })
          });
  
          const data = await response.json();
  
          if (!response.ok) {
              throw new Error(data.error || 'Login failed');
          }
  
          setIsLoggedIn(true);
          setCurrentUser(data.user);
          
      } catch (err) {
          setError(err.message);
      } finally {
          setIsLoading(false);
      }
  };
      
        const handleLogout = () => {
          setIsLoggedIn(false);
          setCurrentUser(null);
        };

        if (isLoggedIn && currentUser) {
            switch (currentUser.accountType) {
              case 'UserAdmin': // Admin
                return <AdminPage user={currentUser} onLogout={handleLogout} />;
              case 'UserProfile': // Admin Profile
                return <AdminProfilePage user={currentUser} onLogout={handleLogout} />;
              case 'Cleaner': // Cleaner
                return <CleanerPage user={currentUser} onLogout={handleLogout} />;
              case 'Homeowner': // Homeowner
                return <HomeownerPage user={currentUser} onLogout={handleLogout} />;
              case 'PlatformManager': // Platform Manager
                return <PlatformManagerPage user={currentUser} onLogout={handleLogout} />;
    }};


    return(
        <>
        <header>
            <h1>Login Page</h1>
        </header>

        <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="accountType">Account Type: </label>
          <select 
            id="accountType" 
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
          >
            <option value="UserAdmin">User Admin</option>
            <option value="UserProfile">User Profile</option>
            <option value="Cleaner">Cleaner</option>
            <option value="Homeowner">Homeowner</option>
            <option value="PlatformManager">Platform Manager</option>
          </select>
        </div>

        <br />

        <div className="form-row">
          <label htmlFor="useraccount">User Account: </label>
          <input 
            type="text" 
            id="useraccount" 
            name="useraccount"
            value={formData.useraccount}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div className="form-row">
          <label htmlFor="password">Password: </label>
          <input 
            type="password" 
            id="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div className="form-row">
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <button type="button">Sign up</button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        </form>
        </>
    )
}