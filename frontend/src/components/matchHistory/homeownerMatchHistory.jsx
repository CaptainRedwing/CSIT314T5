import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function HomeownerMatchHistory() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const {profile_id} = useParams();
    const [serviceListing, setServiceListing] = useState([]);
    const [matchHistory, setMatchHistory] = useState({});
    const [userAccount, setUserAccount] = useState([]);
    const [showMatchHistory, setShowMatchHistory] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showViewHistory, setShowViewHistory] = useState(false);
    const [selectedMatchHistory, setSelectedMatchHistory] = useState({});

    useEffect(() => {
            viewServiceListing();
            viewAllUserAccount();
        }, []);

    const viewServiceListing = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/serviceListing`)
            
            const data = await response.json()
            setServiceListing(data.filter(service => service.cleaner_id == profile_id));

        } catch (error) {
            console.log(error);
            setServiceListing([]);
        }
    }

    const viewAllUserAccount = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/userAdmin`)
            
            const data = await response.json()
            setUserAccount(data)

        } catch (error) {
            console.log(error)
        }
    }

    const viewMatchHistory = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/matchHistory/hview/${searchTerm}`)

            const data = await response.json()
            console.log(data)
            setSelectedMatchHistory(data);
            setShowViewHistory(true);

        } catch (error) {
            console.log(error);
        }
    }

    const searchMatchHistory = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {

            const response = await fetch(`http://localhost:3000/api/matchHistory/hsearch/${searchTerm}`)
            if (!response.ok) throw new Error('Search failed');
            const data = await response.json()
            console.log(data)
            setMatchHistory(data)
            setShowMatchHistory(true);

        } catch (error) {
            console.log(error)
        }
    }

    const getCleanerName = (cleanerId) => {
        const user = userAccount.find(u => u.id === cleanerId);
        return user ? `${user.username}` : 'Unknown User';
    }

    const handleLogout = () => {
        navigate(-1)
    };

    const handleClose = () => {
        setShowMatchHistory(false);
        setShowViewHistory(false);
    }

    return(
        <>
            <h2>My Past Service</h2>

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
                                placeholder="Search by Service title..."
                                className="search-input"
                                style={{ marginLeft: '10px' }}
                            />
                        </div>

                        <div className="search-actions">
                            <button 
                                type="submit" 
                                className="search-button"
                            >
                                Search
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
                        <p><strong>Homeowner:</strong> {getCleanerName(selectedMatchHistory.cleaner_id)}</p>
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
    )
}