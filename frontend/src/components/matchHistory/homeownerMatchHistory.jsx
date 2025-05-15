import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

export default function HomeownerMatchHistory() {
    const [isLoading, setIsLoading] = useState(false);
    const {profile_id} = useParams();
    const [serviceListing, setServiceListing] = useState([]);
    const [matchHistory, setMatchHistory] = useState([]);
    const [userAccount, setUserAccount] = useState([]);
    const [showMatchHistory, setShowMatchHistory] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
            viewServiceListing();
            viewMatchHistory();
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
            // const userIds = matchHistory.map(history => history.homeowner_id);

            // const filteredUserAccount = data.filter(user =>
            //     userIds.includes(userAccount.id)
            // )
            setUserAccount(data)

        } catch (error) {
            console.log(error)
        }
    }

    const viewMatchHistory = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/matchHistory/hview/${profile_id}`)

            const data = await response.json()
            // const serviceIds = serviceListing.map(service => service.id);
            
            // // Filter match history for these service IDs
            // const filteredHistory = data.filter(history => 
            //     serviceIds.includes(history.service_listing_id)
            // );
            
            setMatchHistory(Array.isArray(data) ? data : [])

        } catch (error) {
            console.log(error);
            setMatchHistory([]);
        }
    }

    const searchMatchHistory = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/matchHistory/hsearch/${searchTerm}`)

            const data = await response.json()
            setMatchHistory(Array.isArray(data) ? data : [])

        } catch (error) {
            console.log(error)
        }
    }

    const getCleanerName = (cleanerId) => {
        const user = userAccount.find(u => u.id === cleanerId);
        return user ? `${user.username}` : 'Unknown User';
    }

    const handleView = () => {
        viewMatchHistory();
        setShowMatchHistory(true);
    }

    return(
        <>
            <div className="search-container">
                <h2>My Past Service</h2>

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
                                {isLoading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                        <div className="search-actions">
                            <button
                                type="button"
                                onClick={handleView}
                                className="search-button"
                            >View My Past Services
                            </button>
                        </div>
                    </form>
                </div>
                <div className="profile-list">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Service Title</th>
                                <th>Cleaner</th>
                                <th>Description</th>
                                <th>Price</th>

                            </tr>
                        </thead>
                        {showMatchHistory && (
                            <tbody>
                                {matchHistory.map((history) => (
                                    <tr key={history.id} className="profile-card">
                                        <td>{history.title}</td>
                                        <td>{getCleanerName(history.homeowner_id)}</td>
                                        <td>{history.desciption}</td>
                                        <td>{history.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                </div>
            </div>
        </>
    )
}