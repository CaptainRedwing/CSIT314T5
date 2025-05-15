import React, { useState, useEffect } from "react";

export default function CreateUserAccount() { 

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username : '',
    email:'',
    password: '',
    confirmPassword: '',
    profile_id:'',
    is_active:true
  });


  const [profiles, setProfiles] = useState([]);

      useEffect(() => {

        const viewAllUserAccount = async () => {
          try {
            const response = await fetch("http://localhost:3000/api/userProfile", {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' }
            });
        
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
        
            const data = await response.json();
            
            setProfiles(data);

        
            if (data && data.length > 0) {
              setNewUser(prev => ({
                ...prev,
                profile_id: data[0].id
              }));
            }
          } catch (error) {
            console.error('Error fetching profiles:', error);
            setError(prev => ({ ...prev, profileError: error.message }));
          }
        };

        viewAllUserAccount();
      }, []);


  const handleInputChange = (e) => {  
    const { name, value } = e.target;
    setNewUser(prev => ({...prev, [name]: value}));
    if (error[name]) setError(prev => ({ ...prev, [name]: '' }));
  };

  const createUserAccount = async(e) => {
    e.preventDefault();

    const newError = {};
    if (!newUser.username) newError.username = 'Username is required';
    if (!newUser.email) newError.email = 'Email is required';
    if (!newUser.password) newError.password = 'Password is required';
    if (newUser.password !== newUser.confirmPassword) {
      newError.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }

    setIsLoading(true);


    try {
      const response = await fetch('http://localhost:3000/api/userAdmin', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newUser.username,
          email: newUser.email,
          password: newUser.password,
          user_profile_id: newUser.profile_id,
          is_active: newUser.is_active
        })
      });

      if (!response.ok){
        const errorData = await response.json();
        console.error('Backend error:', errorData);
        throw new Error(errorData.message || 'Failed to create user');
      }

      await response.json();
      
      setShowCreateModal(false);
      setNewUser({
        useraccount : '',
        email:'',
        password: '',
        confirmPassword: '',
        profile_id:'',
        is_active: true
      });
      setError({});
      
    } catch (error) {
      setError({form: error.message});
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileChange = (e) => {

    const selectedId = e.target.value;

    setNewUser(prev => ({
      ...prev,
      profile_id: selectedId
    }));
  };

  return (
    <div className="admin-container">
      <button 
        onClick={() => setShowCreateModal(true)}
        className="create-button"
      >
        Create User Account
      </button>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Create New User</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="close-button"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={createUserAccount}>
              {error.form && <div className="error-message">{error.form}</div>}
              
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={newUser.username}
                  onChange={handleInputChange}
                  className={error.username ? 'error' : ''}
                />
                {error.username && <span className="field-error">{error.username}</span>}
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className={error.email ? 'error' : ''}
                />
                {error.email && <span className="field-error">{error.email}</span>}
              </div>

          <div className="form-group">
          <label>Account Type</label>
          <select
            name="profile_id"
            value={newUser.profile_id}
            onChange={handleProfileChange}
            required
          >
            {profiles.map(profiles => (
                <option key={profiles.id} value={profiles.id}>
                    {profiles.name}
                </option>
                  ))}
          </select>
        </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  className={error.password ? 'error' : ''}
                />
                {error.password && <span className="field-error">{error.password}</span>}
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={newUser.confirmPassword}
                  onChange={handleInputChange}
                  className={error.confirmPassword ? 'error' : ''}
                />
                {error.confirmPassword && (
                  <span className="field-error">{error.confirmPassword}</span>
                )}
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}