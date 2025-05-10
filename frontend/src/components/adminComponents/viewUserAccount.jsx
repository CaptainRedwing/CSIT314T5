import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ViewUserProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userId } = useParams();
    const navigate = useNavigate();
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: ''
    });

    useEffect(() => {

        const viewUserAccount = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/userAdmin/${userId}`);
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch user');
                }
                
                const userData = await response.json();
                
                if (!userData.id || !userData.username) {
                    throw new Error('Invalid user data received');
                }
                
                setUser(userData);
            } catch (err) {
                setError(err.message);
                if (err.message.includes('User not found')) {
                    setTimeout(() => navigate('/'), 2000);
                }
            } finally {
                setLoading(false);
            }
        };

        viewUserAccount();
    }, [userId, navigate]);

    if (loading) return (
        <div className="loading-spinner">
            <div className="spinner"></div>
            Loading user data...
        </div>
    );

    if (error) return (
        <div className="error-alert">
            {error}
            <button className="back-button" onClick={() => navigate('/')}>
                Return to Home
            </button>
        </div>
    );

    const handleUpdate =() => {
        setShowUpdateModal(true);
        setError('');
    }

    const handleCloseModal =() => {
        setShowUpdateModal(false);
        setError('');
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const updateUserAccount = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const updateData = {};
        if (formData.username.trim()) updateData.username = formData.username;
        if (formData.email.trim()) updateData.email = formData.email;
        if (formData.password.trim()) updateData.password = formData.password;
        if (formData.role.trim()) updateData.role = formData.role;
        
        try {
            const response = await fetch(`http://localhost:3000/api/userAdmin/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update user');
            }
            
            const updatedUser = await response.json();
            setUser(updatedUser);
            setShowUpdateModal(false);
            
            setFormData(prev => ({
                ...prev,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                password: ''
            }));
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="loading-spinner">
            <div className="spinner"></div>
            Loading user data...
        </div>
    );

    if (error) return (
        <div className="error-alert">
            {error}
            <button className="back-button" onClick={() => navigate(-1)}>
                Return to Home
            </button>
        </div>
    );

    return (

        <div className="user-page-container">
            <h1>User Details</h1>
            
            <div className="user-info">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
            </div>

            <div className="update-info">
                <button className="update-button" onClick={handleUpdate}>
                    Update User
                </button>
            </div>
            
            <button className="back-button" onClick={() => navigate(-1)}>
                Go Back
            </button>

            {showUpdateModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Update User</h2>
                        <button className="close-button" onClick={handleCloseModal}>
                            &times;
                        </button>
                        
                        <form onSubmit={updateUserAccount}>
                            <div className="form-group">
                                <label htmlFor="username">Username (leave blank to keep current):</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="email">Email (leave blank to keep current):</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="password">New Password (leave blank to keep current):</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter new password"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="role">Role:</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="UserAdmin">UserAdmin</option>
                                    <option value="Cleaner">Cleaner</option>
                                    <option value="Homeowner">Homeowner</option>
                                    <option value="PlatformManager">Platform Manager</option>
                                </select>
                            </div>
                            
                            {error && <div className="error-message">{error}</div>}
                            
                            <div className="form-actions">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Updating...' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}