import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

export default function ServiceListing() {
    const {profile_id} = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTermFav, setSearchTermFav] = useState('');
    const [serviceListing, setServiceListing] = useState([]);
    const [showFavServiceList, setShowFavServiceList] = useState(false);
    const [showServiceList, setShowServiceList] = useState(false)
    const [favoriteServiceListing, setFavoriteServiceListing] = useState([]);

    const [error, setError] = useState('');

    useEffect(() => {
        viewServiceListing();
        viewFavouriteListing();
    }, []);

    const handleChange = () => {
        viewServiceListing();
        setShowServiceList(true);
        serviceViewCount();
    }

    const serviceViewCount = async () => {
        try {
            await Promise.all(serviceListing.map(async (service) => {
            const response = await fetch(
                `http://localhost:3000/api/serviceListing/service-listing/${service.id}/view`,
                { method: 'POST' } 
            );
            if (!response.ok) {
                console.error(`Failed to update view count for service ${service.id}`);
            }
        }));

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

    }
    const handleSearch = async (e) => {
        e.preventDefault();
        searchServiceListing();
    };

    const handleFavSearch = async (e) => {
        e.preventDefault();
        searchFavouriteServiceListing();
    };

    const searchServiceListing = async() => {
        try {

            const response = await fetch(`http://localhost:3000/api/serviceListing/${searchTerm}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
              });
            
            const data = await response.json();

            const servicesArray = Array.isArray(data) ? data : [data].filter(Boolean);
    
            setServiceListing(servicesArray);

        } catch (error) {
            console.log(error);
        }
    }

    const searchFavouriteServiceListing = async() => {
        try {

            const response = await fetch(`http://localhost:3000/api/serviceListing/${searchTermFav}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
              });
            
            const data = await response.json();

            const servicesArray = Array.isArray(data) ? data : [data].filter(Boolean);

            const favoriteServiceIds = favoriteServiceListing.map(fav => fav.id); // adjust to match actual ID field

            const filteredServices = servicesArray.filter(service => 
                service &&
                favoriteServiceIds.includes(service.id) &&
                service.title.toLowerCase().includes(searchTermFav.toLowerCase())
            );
    
            setFavoriteServiceListing(filteredServices);

        } catch (error) {
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
                    service_listing_id: serviceId
                })
            })

            if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add to favorite');
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>

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
                                <th>Description</th>
                                <th>Price</th>
                                <th>Location</th>
                                <th>Service Category</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        {showServiceList && (
                            <tbody>
                                {serviceListing.map((service) => (
                                    <tr key={service.id} className="profile-card">
                                        <td>{service.title}</td>
                                        <td>{service.description}</td>
                                        <td>{service.price}</td>
                                        <td>{service.location}</td>
                                        <td>{service.service_categories_name}</td>
                                        <td>
                                            <button
                                                className="view-button"
                                                onClick={() => addToFavorite(service.id)}
                                            >
                                                Add to Favorite
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                </div>
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
                                <th>Description</th>
                                <th>Price</th>
                                <th>Location</th>
                                <th>Service Category</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        {showFavServiceList && (
                            <tbody>
                                {favoriteServiceListing.map((service) => (
                                    <tr key={service.id} className="profile-card">
                                        <td>{service.title}</td>
                                        <td>{service.description}</td>
                                        <td>{service.price}</td>
                                        <td>{service.location}</td>
                                        <td>{service.service_categories_name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                </div>


            </div>
            </div>
    </>
    );
}