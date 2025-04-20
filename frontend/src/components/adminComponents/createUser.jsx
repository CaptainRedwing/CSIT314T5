import React, { useState } from "react";

export default function CreateUser() { 

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'UserAdmin'
  });


  const handleInputChange = (e) => {  
    const { name, value } = e.target;
    setNewUser(prev => ({...prev, [name]: value}));
    if (error[name]) setError(prev => ({ ...prev, [name]: '' }));
  };

  const handleCreateUser = async(e) => {
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
          role: newUser.role
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
        username: '',
        email: '',
        role: 'UserAdmin',
        password: '',
        confirmPassword: ''
      });
      setError({});
      
    } catch (error) {
      setError({form: error.message});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <button 
        onClick={() => setShowCreateModal(true)}
        className="create-button"
      >
        Create User
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
            
            <form onSubmit={handleCreateUser}>
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
                <label>Role</label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                >
                  <option value="UserAdmin">UserAdmin</option>
                  <option value="Cleaner">Cleaner</option>
                  <option value="Homeowner">Homeowner</option>
                  <option value="PlatformManager">PlatformManager</option>
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