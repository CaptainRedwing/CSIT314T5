import React, { useEffect, useState } from "react";


export default function UserProfile() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [userProfile, setUserProfile] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewUser, setViewUser] = useState(null);
    const [updateData, setUpdateData] = useState({
        id: null,
        name: '',
        description: '',
        is_active: true
      });

    const handleCloseModal = () => {
        setShowUpdateModal(false);
        setShowViewModal(false);
        setError('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateData(prev => ({
          ...prev,
          [name]: value
        }));
    };

    const handleView = async () => {
        setIsLoading(true);
        setError('');

        try {
            const url = searchTerm 
                ? `http://localhost:3000/api/userProfile/search?name=${encodeURIComponent(searchTerm)}`
                : "http://localhost:3000/api/userProfile";
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setUserProfile(Array.isArray(data) ? data : []);
        } catch (error) {
            setError(error.message);
            console.error('Fetch error:', error);
            setUserProfile([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleView();
    }, []);

    const handleSuspendUserProfile = async (profileId) => {
        if (!window.confirm('Are you sure you want to suspend this profile?')) return;
        
        try {
            const response = await fetch(`http://localhost:3000/api/userProfile/${profileId}`, { 
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to suspend User Profile');
            }


            const status = await response.json();

            if (status) {
                alert("Successfully Active/Inactive User Profile")
            }
            
            handleView();
        } catch (error) {
            setError(error.message);
            console.error('Suspend user error:', error);
        }
    };

    const handleViewProfile = async (profileId) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/userProfile/${profileId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }
            const userData = await response.json();
            setViewUser(userData);
            setShowViewModal(true);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {

            const currentProfile = userProfile.find(p => p.id === updateData.id);
            
            const updatePayload = {};
            if (updateData.name && updateData.name !== currentProfile.name) {
            updatePayload.name = updateData.name;
            }
            
            if (updateData.description && updateData.description !== currentProfile.description) {
            updatePayload.description = updateData.description;
            }

            if (Object.keys(updatePayload).length === 0) {
            alert('No changes detected');
            return;
            }

            if (updatePayload.name) {
            const profileExists = userProfile.some(
                profile => 
                profile.id !== updateData.id &&
                profile.name.toLowerCase() === updatePayload.name.toLowerCase()
            );
            
            if (profileExists) {
                throw new Error(`Profile type "${updatePayload.name}" already exists`);
            }
            }

            

            const response = await fetch(`http://localhost:3000/api/userProfile/${updateData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatePayload)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update profile');
            }
            
            handleView();
            setShowUpdateModal(false);
            setShowViewModal(false);
            alert('Profile updated successfully');
            
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateButton = (profile) => {
        setUpdateData({
          id: profile.id,
          name: profile.name,
          description: profile.description,
          is_active: profile.is_active
        });
        setShowUpdateModal(true);
      };

    const handleSearch = async (e) => {
        e.preventDefault();
        handleView();
    };

    if (isLoading) return <div className="loading">Loading profiles...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="search-container">
            <h2>User Profiles</h2>
            
            <div className="search-controls">
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-options">
                        Profile Type:
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by profile name..."
                            className="search-input"
                            style={{ marginLeft: '10px' }}
                        />
                    </div>
                    
                    <div className="search-buttons">
                        <button type="submit" disabled={isLoading} className="search-button">
                            {isLoading ? 'Searching...' : 'Search'}
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={handleView}
                            disabled={isLoading}
                            className="refresh-button"
                        >
                            {isLoading ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="profile-list">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Profile Type</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userProfile.length > 0 ? (
                            userProfile.map((profile) => (
                                <tr key={profile.id} className="profile-card">
                                    <td>{profile.name}</td>
                                    <td>{profile.is_active ? 'Active' : 'Inactive'}</td>
                                    <td className="actions">
                                        <button
                                            className="view-button"
                                            onClick={() => handleViewProfile(profile.id)}
                                        >
                                            View
                                        </button>
                                        <button
                                            className="suspend"
                                            onClick={() => handleSuspendUserProfile(profile.id)}
                                        >
                                            {profile.is_active ? 'Suspend' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="no-profiles">No profiles found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showViewModal && viewUser && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1>Profile Details</h1>
                            <button className="close-button" onClick={handleCloseModal}>
                                &times;
                            </button>
                        </div>
                        
                        <div className="user-info">
                            <div className="detail-row">
                            <p><strong>Name:</strong>
                                {viewUser.name}</p>
                            </div>
                            <div className="detail-row">
                            <p><strong>Description:</strong>
                                {viewUser.description}</p>
                            </div>
                            <div className="detail-row">
                            <p><strong>Status:</strong>
                                {viewUser.is_active ? 'Active' : 'Inactive'}</p>
                            </div>
                        </div>
                        
                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={() => handleUpdateButton(viewUser)}
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

            {showUpdateModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Update Profile</h2>
                            <button className="close-button" onClick={handleCloseModal}>
                                &times;
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={updateData.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Description:</label>
                                <textarea
                                    name="description"
                                    value={updateData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                />
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
                                    {isLoading ? 'Updating...' : 'Update Profile'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}