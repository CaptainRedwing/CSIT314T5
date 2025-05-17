import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function ServiceListing() {
    const navigate = useNavigate();
    const now = new Date();
    const {profile_id} = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTermFav, setSearchTermFav] = useState('');
    const [serviceListing, setServiceListing] = useState([]);
    const [showFavServiceList, setShowFavServiceList] = useState(false);
    const [showServiceList, setShowServiceList] = useState(false)
    const [favoriteServiceListing, setFavoriteServiceListing] = useState([]);
    const [selectedListing, setSelectedListing] = useState(null);
    const [showSelectedListing, setShowSelectedListing] = useState(false);
    const [selectedFavListing, setSelectedFavListing] = useState(null);
    const [showSelectedFavListing, setShowSelectedFavListing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        viewServiceListing();
        viewFavouriteListing();
    }, []);

    const handleChange = () => {
        viewServiceListing();
        setShowServiceList(true);
        setError('');
    }

    const serviceViewCount = async (serviceId) => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/serviceListing/service-listing/${serviceId}/view`,
                { method: 'POST' } 
            );

            if (!response.ok) {
                console.error(`Failed to update view count for service ${serviceId}`);
            }

        } catch (error) {
            console.log(error)
        }
    }

    const serviceListedCount = async (serviceId) => {
        try {

            const response = await fetch(
                `http://localhost:3000/api/serviceListing/service-listing/${serviceId}/short-listed`,
                { method: 'POST' }
            );

            if (!response.ok) {
                console.error(`Failed to update view count for service ${serviceId}`);
            };

        } catch (error) {
            console.log(error)
        }
    }

    // all favourite listing homeowner and service id
    const viewFavouriteListing = async () => {
        try {

            const servicesListing = await fetch(`http://localhost:3000/api/serviceListing`)
            
            const services = await servicesListing.json()
            setServiceListing(services)

            const response = await fetch(`http://localhost:3000/api/favouriteListing`,{
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            
            const data = await response.json()
            const myFavorites = data.filter(
                fav => fav.homeowner_id == profile_id
            );

            const favoriteServiceId = myFavorites.map(fav => fav.service_listing_id);

            const favServices = services.filter(service =>
                favoriteServiceId.includes(service.id)
            )

            setFavoriteServiceListing(favServices);

        } catch (error) {
            console.log(error);
            setFavoriteServiceListing([]);
        }
    }


    // show service listing
    const viewServiceListing = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/serviceListing`)
            
            const data = await response.json()
            setServiceListing(data)
        } catch (error) {
            console.log(error);
            setServiceListing([]);
        }
    }

    const handleFavChange = () => {
        viewFavouriteListing();
        setShowFavServiceList(true);
        setError('');

    }
    const handleSearch = async (e) => {
        e.preventDefault();
        setShowServiceList(true);
        searchServiceListing();
        setError('');
    };

    const handleFavSearch = async (e) => {
        e.preventDefault();
        searchFavouriteServiceListing();
        setShowFavServiceList(true);
        setError('');
    };

    const searchServiceListing = async() => {

        setError('');
        setServiceListing([]);

        try {

            const response = await fetch(`http://localhost:3000/api/serviceListing/search/${searchTerm}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
              });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'No service listing found');
            }

            const data = await response.json();

            const servicesArray = Array.isArray(data) ? data : [data].filter(Boolean);
    
            setServiceListing(servicesArray);
            setError('');

        } catch (error) {
            setError(error.message)
            console.log(error);
        }
    }

    const searchFavouriteServiceListing = async() => {

        setError('');
        setFavoriteServiceListing([]);
        try {

            const response = await fetch(`http://localhost:3000/api/serviceListing/search/${searchTermFav}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
              });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'No Favourite service listing found');
            }
            
            const data = await response.json();

            const servicesArray = Array.isArray(data) ? data : [data].filter(Boolean);

            const favoriteServiceIds = favoriteServiceListing.map(fav => fav.id); // adjust to match actual ID field

            const filteredServices = servicesArray.filter(service => 
                service &&
                favoriteServiceIds.includes(service.id) &&
                service.title.toLowerCase().includes(searchTermFav.toLowerCase())
            );
    
            setFavoriteServiceListing(filteredServices);
            setShowSelectedFavListing(true);
            setError();

        } catch (error) {
            setError(error.message)
            console.log(error);
        }
    }

    const suspendServiceListing = async(serviceId) => {
        if (!window.confirm('Are you sure you want to suspend this service?')) return;

        try {
            const response = await fetch(`http://localhost:3000/api/serviceListing/${serviceId}`, {
                method:'DELETE',
                headers: {'Content-Type':'application/json'}
            });

            if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to suspend user');
            }

            await viewServiceListing();
            alert('Service suspended successfully')
        } catch (error) {
            console.error(error);
        }
    }

    const viewSpecifyListing = async (serviceId) => {
        serviceViewCount(serviceId);
        setIsLoading(true);
        try {
        const response = await fetch(`http://localhost:3000/api/serviceListing/${serviceId}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch service listing details');
        }
        
        const userData = await response.json();
        setSelectedListing(userData);
        setShowSelectedListing(true);
        
        } catch (error) {
        setError(error.message);
        } finally {
        setIsLoading(false);
        }
    };

    const viewSpecifyFavListing = async (serviceId) => {
        setIsLoading(true);
        try {

            const response = await fetch(`http://localhost:3000/api/serviceListing/${serviceId}`)

            if (!response.ok) {
            throw new Error('Failed to fetch favourite service listing details');
        }
            
            const data = await response.json()
            // const myFavorites = data.filter(
            //     fav => fav.homeowner_id == profile_id
            // );

            // const favoriteServiceId = myFavorites.map(fav => fav.service_listing_id);

            // const favServices = services.filter(service =>
            //     favoriteServiceId.includes(service.id)
            // )
            setSelectedFavListing(data);
            setShowSelectedFavListing(true);
            setError('');
        } catch (error) {
        setError(error.message);
        } finally {
        setIsLoading(false);
        }
    };

    const addToFavorite = async(serviceId) => {

        serviceListedCount(serviceId);

        const isAlreadyFavorite = favoriteServiceListing.some(
                fav => fav.service_listing_id === serviceId && fav.homeowner_id === profile_id
            );
            
            if (isAlreadyFavorite) {
                setError('This service is already in your favorites');
                return;
            }

        try {
            const response = await fetch(`http://localhost:3000/api/favouriteListing`, {
                method: "POST",
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    homeowner_id: profile_id,
                    service_listing_id: serviceId,
                    added_at: now
                })
            })

            if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add to favorite');
            
            }

            alert('Service Listing Added Successfilly')
            setError('');
        } catch (error) {
            setError(error.message)
            console.error(error);
        }
    }

    const bookService = async(serviceId) => {

    }

    const handlePastServicePage = () => {
        navigate('/homeownerMatchHitory')
    }

    const handleCloseModal = () => {
        setShowSelectedListing(false);
        setShowSelectedFavListing(false);
        setError('');
    };

    return (
        <>
            <button
                onClick={handlePastServicePage}
                className="create-button"
            >
                View Past Service
            </button>
            {error && <div className="error-message">{error}</div>}
            <div className="search-container">
                <h2>All Service Listing</h2>
                <div className="search-controls">
                    <form onSubmit={handleSearch}>
                        <div className="search-options">
                        <span className="search-label">Service Title:</span>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by Service name..."
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
                            onClick={handleChange}
                            className="search-button"
                        >View Service List
                        </button>
                        </div>
                    </form>
                </div>

                <div className="profile-list">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Service Title</th>
                                <th>Service Category</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        {showServiceList && (
                            <tbody>
                                {serviceListing.map((service) => (
                                    <tr key={service.id} className="profile-card">
                                        <td>{service.title}</td>
                                        <td>{service.service_categories_name}</td>
                                        <td>{service.price}</td>
                                        <td>
                                            <button 
                                                className="view-button"
                                                onClick={() => viewSpecifyListing(service.id)}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                </div>

            {showSelectedListing && selectedListing && (
                <div className="modal-overlay">
                <div className="modal-content">
                    <div className="modal-header">
                    <h2>Service Listing Details</h2>
                    <button className="close-button" onClick={handleCloseModal}>
                        &times;
                    </button>
                    </div>
                    
                    <div className="user-info">
                    <p><strong>Service Title:</strong> {selectedListing.title}</p>
                    <p><strong>Description:</strong> {selectedListing.description}</p>
                    <p><strong>Price:</strong> {selectedListing.price}</p>
                    <p><strong>Location:</strong> {selectedListing.location}</p>
                    <p><strong>Service Category name:</strong> {selectedListing.service_categories_name}</p>
                    </div>
                    
                    <div className="form-actions">
                        <button
                            className="view-button"
                            onClick={() => addToFavorite(selectedListing.id)}
                        >
                            Add to Favorite
                        </button>
                        <button
                            className="view-button">
                            Book Service(No function)
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

            <h2>My Favorite Listing</h2>

            <div className="search-container">
                <div className="search-controls">
                    <form onSubmit={handleFavSearch}>
                        <div className="search-options">
                        <span className="search-label">Service Title:</span>
                        <input
                            type="text"
                            value={searchTermFav}
                            onChange={(e) => setSearchTermFav(e.target.value)}
                            placeholder="Search by Service name..."
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
                            onClick={handleFavChange}
                            className="search-button"
                        >View Favourtie List
                        </button>
                        </div>
                    </form>
                </div>

                <div className="profile-list">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Service Title</th>
                                <th>Service Category</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        {showFavServiceList && (
                            <tbody>
                                {favoriteServiceListing.map((service) => (
                                    <tr key={service.id} className="profile-card">
                                        <td>{service.title}</td>
                                        <td>{service.service_categories_name}</td>
                                        <td>{service.price}</td>
                                        <td>
                                            <button 
                                                className="view-button"
                                                onClick={() => viewSpecifyFavListing(service.id)}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                </div>

            {showSelectedFavListing && selectedFavListing && (
                <div className="modal-overlay">
                <div className="modal-content">
                    <div className="modal-header">
                    <h2>Favourite Service Listing Details</h2>
                    <button className="close-button" onClick={handleCloseModal}>
                        &times;
                    </button>
                    </div>
                    
                    <div className="user-info">
                    <p><strong>Service Title:</strong> {selectedFavListing.title}</p>
                    <p><strong>Description:</strong> {selectedFavListing.description}</p>
                    <p><strong>Price:</strong> {selectedFavListing.price}</p>
                    <p><strong>Location:</strong> {selectedFavListing.location}</p>
                    <p><strong>Service Category name:</strong> {selectedFavListing.service_categories_name}</p>
                    </div>
                    
                    <div className="form-actions">
                        <button
                            className="view-button"
                        >
                            Book Service (No function)
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


            </div>
            </div>
    </>
    );
}