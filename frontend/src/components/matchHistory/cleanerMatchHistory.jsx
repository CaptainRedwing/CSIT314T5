import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

export default function CleanerMatchHistory() {
    const {profile_id} = useParams();
    const [serviceListing, setServiceListing] = useState([]);
    const [matchHistory, setMatchHistory] = useState([]);
    const [userAccount, setUserAccount] = useState([]);
    const [showMatchHistory, setShowMatchHistory] = useState(false);

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
            const response = await fetch(`http://localhost:3000/api/matchHistory/cview/${profile_id}`)

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

    const getHomeownerName = (homeownerId) => {
        const user = userAccount.find(u => u.id === homeownerId);
        return user ? `${user.first_name} ${user.last_name}` : 'Unknown User';
    }

    const handleView = () => {
        viewMatchHistory();
        setShowMatchHistory(true);
    }

    return(
        <>
            <h2>Past Service Matches</h2>

            <button
                type="button"
                onClick={handleView}
                className="create-button"
                style={{ marginLeft: '10px' }}
            >View Past Services
            </button>
            <div className="search-container">
                <div className="profile-list">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Service Title</th>
                                <th>Homeowner</th>
                                <th>Service Date</th>
                                <th>Description</th>
                                <th>Price</th>

                            </tr>
                        </thead>
                        {showMatchHistory && (
                            <tbody>
                                {matchHistory.map((history) => (
                                    <tr key={history.id} className="profile-card">
                                        <td>{history.title}</td>
                                        <td>{getHomeownerName(history.homeowner_id)}</td>
                                        <td>{history.service_date}</td>
                                        <td>{history.description}</td>
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