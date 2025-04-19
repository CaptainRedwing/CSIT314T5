import React, { useState } from "react";

export default function CreateUser() {  // Changed to uppercase
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [errors, setErrors] = useState({});  // Added errors state
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    role: 'user',  // Changed default to match options
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {  // Moved outside handleCreateUser
    const { name, value } = e.target;
    setNewUser(prev => ({...prev, [name]: value}));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleCreateUser = async(e) => {
    e.preventDefault();

    const newErrors = {};
    if (!newUser.username) newErrors.username = 'Username is required';
    if (!newUser.email) newErrors.email = 'Email is required';
    if (!newUser.password) newErrors.password = 'Password is required';
    if (newUser.password !== newUser.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoadingUsers(true);

    try {
      const response = await fetch('http://localhost:3000/api/adminpage/1', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          password: newUser.password
        }),
      });

      if (!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      const createdUser = await response.json();
      
      setShowCreateModal(false);
      setNewUser({
        username: '',
        email: '',
        role: 'option1',
        password: '',
        confirmPassword: ''
      });
      setErrors({});
      
    } catch (error) {
      setErrors({form: error.message});
    } finally {
      setIsLoadingUsers(false);
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
              {errors.form && <div className="error-message">{errors.form}</div>}
              
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={newUser.username}
                  onChange={handleInputChange}
                  className={errors.username ? 'error' : ''}
                />
                {errors.username && <span className="field-error">{errors.username}</span>}
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                >
                  <option value="option1">UserAdmin</option>
                  <option value="option2">Cleaner</option>
                  <option value="option3">Homeowner</option>
                  <option value="option4">PlatformManager</option>
                </select>
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  className={errors.password ? 'error' : ''}
                />
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={newUser.confirmPassword}
                  onChange={handleInputChange}
                  className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && (
                  <span className="field-error">{errors.confirmPassword}</span>
                )}
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  disabled={isLoadingUsers}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isLoadingUsers}
                >
                  {isLoadingUsers ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}