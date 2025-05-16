import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function CleanerMatchHistory() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const {profile_id} = useParams();
    const [serviceListing, setServiceListing] = useState([]);
    const [matchHistory, setMatchHistory] = useState({});
    const [selectedMatchHistory, setSelectedMatchHistory] = useState([]);
    const [userAccount, setUserAccount] = useState([]);
    const [showMatchHistory, setShowMatchHistory] = useState(false);
    const [showViewHistory, setShowViewHistory] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        viewAllUserAccount();
        viewServiceListing();
    }, [])
    const viewServiceListing = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/serviceListing`);
            if (!response.ok) throw new Error('Failed to fetch service listings');
            
            const data = await response.json();
            setServiceListing(data.filter(service => service.cleaner_id == profile_id));
        } catch (error) {
            console.error(error);
            setError('Failed to load service listings');
            setServiceListing([]);
        }
    }

    const viewAllUserAccount = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/userAdmin`);
            if (!response.ok) throw new Error('Failed to fetch user accounts');
            
            const data = await response.json();
            setUserAccount(data);
        } catch (error) {
            console.error(error);
            setError('Failed to load user accounts');
            setUserAccount([]);
        }
    }

    const viewMatchHistory = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/matchHistory/cview/${searchTerm}`);
            if (!response.ok) throw new Error('Failed to fetch match history');
            
            const data = await response.json();
            console.log(data)
            setSelectedMatchHistory(data);
            setShowViewHistory(true);
            
        } catch (error) {
            console.error(error);
            setError('Failed to load match history');
            setMatchHistory({});
        }
    }

    const searchMatchHistory = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/matchHistory/csearch/${searchTerm}`);
            if (!response.ok) throw new Error('Search failed');
            
            const data = await response.json();
            console.log(data)
            setMatchHistory(data)
            setShowMatchHistory(true);
        } catch (error) {
            console.error(error);
            setError('Search failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    const getHomeownerName = (homeownerId) => {
        const user = userAccount.find(u => u.id === homeownerId);
        return user ? `${user.username}` : 'Unknown User';
    }

    const getTime = (time) => {
        const formattedDate = time.split('T')[0]; // "2025-05-09"
        return formattedDate
    }

    const handleClose = () => {
        setShowMatchHistory(false);
        setShowViewHistory(false);
    }

    const handleLogout = () => {
        navigate(-1)
    };

    return (
        <>
            <h2>Past Service Matches</h2>

            <button
                onClick={handleLogout}
            >
                Go back
            </button>

            <div className="search-container">
                <div className="search-controls">
                    <form onSubmit={searchMatchHistory}>
                        <div className="search-options">
                            <span className="search-label">Service Title:</span>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by Service name..."
                                className="search-input"
                                style={{ marginLeft: '10px' }}
                                disabled={isLoading}
                            />
                        </div>
                        
                        <div className="search-actions">
                            <button 
                                type="submit" 
                                className="search-button"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="profile-list">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Service Title</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        {showMatchHistory && (
                            <tbody>
                                <td>{matchHistory.title}</td>
                                <td>{matchHistory.service_categories_name}</td>
                                <td>{matchHistory.price}</td>
                                <td>
                                    <button 
                                        className="view-button"
                                        onClick={() => viewMatchHistory()}
                                    >
                                        View
                                    </button>
                                </td>
                            </tbody>
                        )}
                    </table>

                {showViewHistory && selectedMatchHistory && (
                    <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                        <h2>Past Match Service</h2>
                            <button 
                                className="close-button"
                                onClick={handleClose}
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="user-info">
                        <p><strong>Service Title:</strong> {selectedMatchHistory.title}</p>
                        <p><strong>Service Date:</strong> {getTime(selectedMatchHistory.service_date)}</p>
                        <p><strong>Homeowner:</strong> {getHomeownerName(selectedMatchHistory.homeowner_id)}</p>
                        <p><strong>Description:</strong> {selectedMatchHistory.description}</p>
                        <p><strong>Price:</strong> {selectedMatchHistory.price}</p>
                        </div>
                        
                        <div className="form-actions">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="cancel-button"
                        >
                            Close
                        </button>
                        </div>
                    </div>
                    </div>
                )}

                
                </div>
            </div>
        </>
    );
}