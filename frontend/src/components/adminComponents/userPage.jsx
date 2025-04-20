import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function UserPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
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

        fetchUserData();
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

    return (
        <div className="user-page-container">
            <h1>User Details</h1>
            
            <div className="user-info">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
            </div>
            
            <button className="back-button" onClick={() => navigate(-1)}>
                Go Back
            </button>
        </div>
    );
}