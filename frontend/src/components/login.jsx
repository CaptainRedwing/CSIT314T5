import React, { useState } from "react"
import { useNavigate } from 'react-router-dom';


export default function login() {

  const navigate = useNavigate();

    const [formData, setFormData] = useState({

        useraccount : '',
        password: '',
        accountType : 'UserAdmin'
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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
        
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          
          switch(data.user.accountType) {
              case 'UserAdmin':
                  navigate('/adminPage');
                  break;
              case 'Cleaner':
                  navigate('/cleanerPage');
                  break;
              case 'Homeowner':
                  navigate('/homeownerPage');
                  break;
              case 'PlatformManager':
                  navigate('/platformManagerPage');
                  break;
              default:
                  navigate('/');
          }
          
      } catch (err) {
          setError(err.message);
      } finally {
          setIsLoading(false);
      }
  };


    return (
      <div className="login-container">
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
              <option value="Cleaner">Cleaner</option>
              <option value="Homeowner">Homeowner</option>
              <option value="PlatformManager">Platform Manager</option>
            </select>
          </div>
  
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
  
          <div className="form-row">
            <button 
              type="submit" 
              disabled={isLoading}
              className={isLoading ? 'logging-in' : ''}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
          
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    );
}