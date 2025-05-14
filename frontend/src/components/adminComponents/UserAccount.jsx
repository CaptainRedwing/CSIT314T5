import React, { useState, useEffect } from "react";

export default function UserAccount() { 
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('username');
  const [showUserAccount, setShowUserAccount] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    username: '',
    email: '',
    password: '',
    profile_id: '',
    is_active: true
  });

  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    viewAllUserAccount();
    viewAllUserProfile();
  }, []);

  const viewAllUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/api/userProfile');
      
      if (!response.ok) {
        throw new Error('Failed to fetch profiles');
      }

      const data = await response.json();
      setProfiles(data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setIsLoading(false);
    }
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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      viewAllUserAccount();
      return;
    }
  
    setIsLoading(true);
    setError('');
  
    try {
      const params = new URLSearchParams();
      if (searchBy === 'username') {
        params.append('username', searchTerm);
      } else if (searchBy === 'profile_id') {
        params.append('profile_id', searchTerm); // Changed from 'role' to 'profile_id'
      }
  
      const response = await fetch(`http://localhost:3000/api/userAdmin/search?${params.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Search failed');
      }
  
      const data = await response.json();
      setUsers(data.length ? data : []); // Handle empty results
    } catch (error) {
      setError("Search failed: " + error.message);
      console.error("Search failed:", error);
      setUsers([]); // Clear results on error
    } finally {
      setIsLoading(false);
    }
  };

  const viewSpecifyUser = async (userId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/userAdmin/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      
      const userData = await response.json();
      setSelectedUser(userData);
      setShowUserModal(true);
      
      setUpdateData({
        username: userData.username,
        email: userData.email,
        password: '',
        profile_id: userData.profile_id,
        is_active: userData.is_active // Add this line
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getProfileNameById = (profileId) => {
    const profile = profiles.find(profile => profile.id === profileId);
    return profile ? profile.name : 'Unknown';
  };

  const suspendUserAccount = async (userId) => {
    if (!window.confirm('Are you sure you want to suspend this user?')) return;
    
    try {
      const response = await fetch(`http://localhost:3000/api/userAdmin/${userId}`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to suspend user');
      }

      await viewAllUserAccount();
      alert('User suspended successfully');
    } catch (error) {
      setError(error.message);
      console.error('Suspend user error:', error);
    }
  };

  const handleCloseModal = () => {
    setShowUserModal(false);
    setShowUpdateModal(false);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateUserAccount = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:3000/api/userAdmin/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: updateData.username,
          email: updateData.email,
          password: updateData.password,
          profile_id: updateData.profile_id,
          is_active: updateData.is_active // Add this line
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }
      
      const updatedUser = await response.json();
      setSelectedUser(updatedUser);
      // Close both modals after successful update
      setShowUpdateModal(false);
      setShowUserModal(false);
      await viewAllUserAccount();
      alert('User updated successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

    const handleChange = () => {
        viewAllUserAccount();
        setShowUserAccount(true);
    }

  return (
    <div className="search-container">
      <h2>User Accounts</h2>
      
      <div className="search-controls">
        <form onSubmit={handleSearch}>
          <div className="search-options">
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className="search-select"
            >
              <option value="username">Username</option>
              <option value="profile_id">User Profile</option>
            </select>
            
            {searchBy === 'profile_id' ? (
              <select
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              >
                <option value="">Select a profile</option>
                {profiles.map(profile => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter username..."
                className="search-input"
              />
            )}
          </div>
          
          <div className="search-buttons">
            <button type="submit" disabled={isLoading} className="search-button">
              {isLoading ? 'Searching...' : 'Search'}
            </button>
            
            <button 
              type="button" 
              onClick={handleChange}
              disabled={isLoading}
              className="refresh-button"
            >
              View User Account
            </button>
          </div>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          {showUserAccount && (
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{getProfileNameById(user.profile_id)}</td>
                <td>
                  <button 
                    className="view-button"
                    onClick={() => viewSpecifyUser(user.id)}
                  >
                    View
                  </button>
                  
                  <button 
                    className="suspend"
                    onClick={() => suspendUserAccount(user.id)}
                  >
                    Suspend
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          )}
        </table>
      )}

      {showUserModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>User Details</h2>
              <button className="close-button" onClick={handleCloseModal}>
                &times;
              </button>
            </div>
            
            <div className="user-info">
              <p><strong>Username:</strong> {selectedUser.username}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Role:</strong> {getProfileNameById(selectedUser.profile_id)}</p>
              <p><strong>Status:</strong> {selectedUser.is_active ? 'Active' : 'Inactive'}</p>
            </div>
            
            <div className="form-actions">
              <button
                type="button"
                onClick={() => setShowUpdateModal(true)}
                className="update-button"
              >
                Update
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                className="cancel-button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpdateModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Update User</h2>
              <button className="close-button" onClick={handleCloseModal}>
                &times;
              </button>
            </div>
            
            <form onSubmit={updateUserAccount}>
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  name="username"
                  value={updateData.username}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={updateData.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>New Password (leave blank to keep current):</label>
                <input
                  type="password"
                  name="password"
                  value={updateData.password}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                />
              </div>
              
              <div className="form-group">
                <label>Role:</label>
                <select
                  name="profile_id"
                  value={updateData.profile_id}
                  onChange={handleInputChange}
                >
                  {profiles.map(profile => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Status:</label>
                <div className="status-toggle">
                  <label>
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={updateData.is_active}
                      onChange={(e) => setUpdateData(prev => ({
                        ...prev,
                        is_active: e.target.checked
                      }))}
                    />
                    {updateData.is_active ? 'Active' : 'Inactive'}
                  </label>
                </div>
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isLoading}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="submit-button"
                >
                  {isLoading ? 'Updating...' : 'Update User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}