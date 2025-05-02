import React, { useEffect, useState } from "react";
import CreateProfile from "./createUserProfile";
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [userProfile, setUserProfile] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [currentProfileId, setCurrentProfileId] = useState(null);
    const [updateUser, setUpdateUser] = useState({
        name: '',
        description: '',
        is_active: true
    });

    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/adminPage', { replace: true });
    };

    const handleCloseModal = () => {
        setShowUpdateModal(false);
        setError('');
        setCurrentProfileId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleView = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch("http://localhost:3000/api/userProfile");
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (!Array.isArray(data)) {
                throw new Error("Expected array but got: " + typeof data);
            }
            
            setUserProfile(data);
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

            alert('User Profile suspended successfully');
            handleView();
        } catch (error) {
            setError(error.message);
            console.error('Suspend user error:', error);
        }
    };

    const handleOpenUpdateModal = (profile) => {
        setCurrentProfileId(profile.id);
        setUpdateUser({
            name: profile.name,
            description: profile.description,
            is_active: profile.is_active
        });
        setShowUpdateModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {

            const profileTypeExists = userProfile.some(
                profile => 
                    profile.id !== currentProfileId &&
                    profile.name.toLowerCase() === updateUser.name.toLowerCase()
            );
    
            if (profileTypeExists) {
                alert(`Profile type "${updateUser.name}" already exists`);
                return;
            }

            const response = await fetch(`http://localhost:3000/api/userProfile/${currentProfileId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateUser)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update profile');
            }
            
            handleView();
            setShowUpdateModal(false);
            alert('Profile updated successfully');
            
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };


    if (isLoading) return <div className="loading">Loading profiles...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    
    const profilesToRender = Array.isArray(userProfile) ? userProfile : [];

    return (
        <div className="search-container">
            <CreateProfile onProfileCreated={handleView} />

            <button 
              type="button" 
              onClick={handleView}
              disabled={isLoading}
              className="view-button"
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>

            <div className="profile-list">
                {profilesToRender.map((profile) => (
                    <div key={profile.id} className="profile-card">
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th colSpan="2">Profile Type: {profile.name}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Status</td>
                                    <td>Description</td>
                                    <td>Actions</td>
                                </tr>
                                <tr>
                                    <td>{profile.is_active ? 'Active' : 'Inactive'}</td>
                                    <td>{profile.description}</td>
                                    <td colSpan="2" className="actions">
                                        <button
                                            className="update-button"
                                            onClick={() => handleOpenUpdateModal(profile)}
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="suspend"
                                            onClick={() => handleSuspendUserProfile(profile.id)}
                                        >
                                            Suspend
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>

            <button className="back-button" onClick={handleLogout}>
                Go Back
            </button>

            {profilesToRender.length === 0 && !isLoading && (
                <div className="no-profiles">No profiles available</div>
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
                                    value={updateUser.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Description:</label>
                                <textarea
                                    name="description"
                                    value={updateUser.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    required
                                />
                            </div>
                            
                            {error && <div className="error-message">{error}</div>}
                            
                            <div className="form-actions">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
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