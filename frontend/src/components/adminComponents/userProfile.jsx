import React, { useEffect, useState } from 'react';

export default function UserProfile() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [userProfile, setUserProfile] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUserProfile, setSelectedUserProfile] = useState(null);
    const [showSelectedUserProfile, setShowSelectedUserProfile] = useState(false);
    const [updateData, setUpdateData] = useState({
        id: null,
        name: '',
        description: '',
        is_active: true
    });

    const viewAllUserProfile = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:3000/api/userProfile");
            if (!response.ok) throw new Error('Failed to fetch profiles');
            const data = await response.json();
            setUserProfile(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const searchUserProfile = async () => {
        if (!searchTerm.trim()) {
            viewAllUserProfile();
            return;
        }

        setIsLoading(true);
        setError('');
        
        try {
            const response = await fetch(`http://localhost:3000/api/userProfile/search/${encodeURIComponent(searchTerm)}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Profile not found');
            }
            
            const data = await response.json();
            console.log(data)
            // Convert single profile to array for consistent table rendering
            setUserProfile(data);
            setShowUserProfile(true);
        } catch (error) {
            setError(error.message);
            setUserProfile([]);
        } finally {
            setIsLoading(false);
        }
    };

    const suspendUserProfile = async (userId) => {
        if (!window.confirm('Are you sure you want to suspend this user?')) return;
        
        try {
          const response = await fetch(`http://localhost:3000/api/userProfile/${userId}`, { 
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to suspend profile');
          }
    
          await viewAllUserProfile();
          alert('User Profile is suspended');
        } catch (error) {
          setError(error.message);
          console.error('Suspend user error:', error);
        }
      };
    

    const handleUpdate = (profile) => {
        setUpdateData({
            id: profile.id,
            name: profile.name,
            description: profile.description,
            is_active: profile.is_active
        });
        setShowUpdateModal(true);
    };

    const updateUserProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/userProfile/${updateData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });
            if (!response.ok) throw new Error('Update failed');
            await viewAllUserProfile();
            setShowUpdateModal(false);
            alert('Profile Detailed updated')
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        viewAllUserProfile();
    }, []);

    const handleCloseModal = () => {
        setShowSelectedUserProfile(false);
        setShowUpdateModal(false);
        setError('');
    };

    
    const handleChange = () => {
        viewAllUserProfile();
        setShowUserProfile(true);
    }

    const viewSpecifyUserProfile = async (profileId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/userProfile/${profileId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user profile details');
      }
      
      const userData = await response.json();
      setSelectedUserProfile(userData);
      setShowSelectedUserProfile(true);
    
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

    return (
        <div className="user-profile-container">
            <h2>User Profiles</h2>
            
            <div className="search-controls">
                <form onSubmit={(e) => { e.preventDefault(); searchUserProfile(); }}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by profile name..."
                    />
                    <button type="submit">Search</button>
                    <button type="button" 
                        onClick={handleChange}
                        >View User Profile
                    </button>
                </form>
            </div>

            {error && <div className="error-message">{error}</div>}

            {isLoading ? (
                <div className="loading">Loading profiles...</div>
            ) : (
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {showUserProfile && (
                    <tbody>
                        {userProfile.length > 0 ? (
                            userProfile.map(profile => (
                                <tr key={profile.id}>
                                    <td>{profile.name}</td>
                                    <td>{profile.is_active ? 'Active' : 'Suspended'}</td>
                                    <td>
                                        <button 
                                            className="view-button"
                                            onClick={() => viewSpecifyUserProfile(profile.id)}
                                        >
                                            View
                                        </button>
                                        <button 
                                            className={profile.is_active ? 'suspend' : 'suspend'}
                                            onClick={() => suspendUserProfile(profile.id)}
                                        >
                                            Suspend
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No profiles found</td>
                            </tr>
                        )}
                    </tbody>
                )}
                </table>
            )}

        {showSelectedUserProfile && selectedUserProfile && (
            <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                <h2>User Profile Details</h2>
                    <button onClick={handleCloseModal}>×</button>
                </div>
                
                <div className="user-info">
                <p><strong>Profile Name:</strong> {selectedUserProfile.name}</p>
                <p><strong>Description:</strong> {selectedUserProfile.description}</p>
                <p><strong>Status:</strong> {selectedUserProfile.is_active ? 'Active' : 'Suspended'}</p>
                </div>
                
                <div className="form-actions">
                <button 
                    className="update-button"
                    onClick={() => handleUpdate(selectedUserProfile)}
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

            {showUpdateModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Update Profile</h3>
                            <button onClick={() => setShowUpdateModal(false)}>×</button>
                        </div>
                        <form onSubmit={updateUserProfile}>
                            <div className="form-group">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={updateData.name}
                                    onChange={(e) => setUpdateData({...updateData, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description:</label>
                                <textarea
                                    name="description"
                                    value={updateData.description}
                                    onChange={(e) => setUpdateData({...updateData, description: e.target.value})}
                                    rows={3}
                                />
                            </div>
                            <div className="form-group">
                                <label>Status:</label>
                                <label className="status-toggle">
                                    <input
                                        type="checkbox"
                                        checked={updateData.is_active}
                                        onChange={(e) => setUpdateData({...updateData, is_active: e.target.checked})}
                                    />
                                    {updateData.is_active ? 'Active' : 'Inactive'}
                                </label>
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={() => setShowUpdateModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={isLoading}>
                                    {isLoading ? 'Updating...' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}