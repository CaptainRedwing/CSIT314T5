import React, { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';


export default function login() {

  const navigate = useNavigate();

    const [formData, setFormData] = useState({

        username : '',
        password: '',
        role : ''
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
      const fetchRoles = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/userProfile');
          if (!response.ok) {
            throw new Error('Failed to fetch roles');
          }
          const data = await response.json();
          
          // Option 1: Store just the role names
          const roleNames = data.map(role => role.name);
          setRoles(roleNames);
          
          // Set initial role if there are any roles
          if (roleNames.length > 0) {
            setFormData(prev => ({
              ...prev,
              role: roleNames[0]
            }));
          }
        } catch (error) {
          console.error('Error fetching roles:', error);
          setRoles([]);
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
            username: formData.username,
            password: formData.password,
            role: formData.role
          })
        });
    
        const data = await response.json();
        const a = true

        if (!data) {
          throw new Error('Authentication failed')
        } else {
          localStorage.setItem('isAuthenticated', 'true');
          
          switch(formData.role) {
            case 'UserAdmin':
              navigate('/adminPage');
              break;
            case 'Cleaner':
              navigate('/cleanerPage');
              break;
            case 'Homeowner':
              navigate(`/homeowner/${formData.username}`);
              break;
            case 'PlatformManager':
              navigate(`/platform-manager/${formData.username}`);
              break;
            default:
              navigate('/');
          }
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
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            {roles.map((roleName, index) => (
              <option key={index} value={roleName}>
                {roleName}
              </option>
            ))}
          </select>
        </div>
  
          <div className="form-row">
            <label htmlFor="username">User Account: </label>
            <input 
              type="text" 
              id="username" 
              name="username"
              value={formData.username}
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