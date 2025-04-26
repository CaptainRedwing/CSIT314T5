import React, { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';


export default function login() {

  const navigate = useNavigate();

    const [formData, setFormData] = useState({

        useraccount : '',
        password: '',
        accountType : ''
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
      const fetchRoles = async () => {
        const response = await fetch('http://localhost:3000/api/login/roles');

        const data = await response.json();
        console.log(data);
        setRoles(data.roles);


        if (data.roles.length > 0) {
          setFormData(prev => ({
            ...prev,
            accountType: data.roles[0]
          }));
        }
      };
      fetchRoles();
    }, []);

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
                  userAccount: formData.useraccount,
                  password: formData.password,
                  accountType: formData.accountType
              })
          });
  
          const data = await response.json();
  
          if (!response.ok) {
              throw new Error(data.error || 'Login failed');
          }
        
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          
          if(response)
            switch(formData.accountType) {
              case 'UserAdmin':
                  navigate(`UserAdmin/${formData.useraccount}}`);
                  break;
              case 'Cleaner':
                  navigate(`Cleaner/${formData.useraccount}}`);
                  break;
              case 'Homeowner':
                  navigate(`Homeowner/${formData.useraccount}}`);
                  break;
              case 'PlatformManager':
                  navigate(`PlatformManager/${formData.useraccount}}`);
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
        <div className="form-group">
          <label>Account Type</label>
          <select
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
            required
          >
            {roles.map(role => (
              <option key={role} value={role}>
                {role.replace(/([A-Z])/g, ' $1').trim()}
              </option>
            ))}
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