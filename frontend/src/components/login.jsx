import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    profile_id: ''
  });

  const [users, setUsers] = useState([]);



  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3000/api/userProfile');
        
        if (!response.ok) {
          throw new Error('Failed to fetch profiles');
        }

        const data = await response.json();
        const activeProfiles = data.filter(profile => profile.is_active === true);
            
        setProfiles(activeProfiles);

        if (activeProfiles.length > 0) {
          setFormData(prev => ({
            ...prev,
              profile_id: activeProfiles[0].id
            }));
          }
            setError(''); // Clear errors on success
      } catch (error) {
        console.error('Error fetching profiles:', error);
        setError('Failed to load profile options. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfiles();
    viewAllUserAccount();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user makes changes
    if (error) setError('');
  };

  const viewAllUserAccount = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch("http://localhost:3000/api/userAdmin", { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError(error.message);
      console.error('Fetch users error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.username || !formData.password || !formData.profile_id) {
      setError('Please enter username or password');
      return;
    }

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
          profile_id: formData.profile_id
        })  
      });

      

      const data = await response.json();
      console.log(data)

      
      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Invalid usernamd or password');
      }

      const currentUser = users.find(user => user.username === formData.username);
      if (currentUser && !currentUser.is_active) {
      setError('Account is suspended');
      setFormData(prev => ({
        ...prev,
        password: '' // Clear password for security
      }));
      return;
      }
      
      // Store authentication data
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', formData.username);
      localStorage.setItem('profile_id', formData.profile_id);

      // Navigation based on profile_id
      const user_id = currentUser?.id; 

      switch(String(formData.profile_id)) {
        case '1': // Admin
          navigate('/adminPage');
          break;
        case '2': // Cleaner
          navigate(`/cleanerPage/${user_id}`);
          break;
        case '3': // Homeowner
          navigate(`/homeownerPage/${user_id}`);
          break;
        case '4': // Platform Manager
          navigate('/platformManagerPage');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.message);
      // Reset form but keep entered values
      setFormData(prev => ({
        ...prev,
        password: '' // Clear password for security
      }));
    } finally {
      setIsLoading(false); // Always reset loading state
    }
  };

  return (
    <div className="login-container">
      <header>
        <h1>Login Page</h1>
      </header>

      {isLoading && !profiles.length ? (
        <div>Loading profile options...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : null}

      <form onSubmit={login}>
        <div className="form-login">
          <label>Account Type</label>
          <select
            name="profile_id"
            value={formData.profile_id}
            onChange={handleChange}
            required
            disabled={isLoading}
            aria-label="Account Type"
          >
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="username">Username: </label>
          <input 
            type="text" 
            id="username" 
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>

        <div className="form-row">
          <button 
            type="submit" 
            aria-label="Login button"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
}