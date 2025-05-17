import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function ServiceListing() {
    const navigate = useNavigate();
    const {profile_id} = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const now = new Date();
    const [serviceListing, setServiceListing] = useState([]);
    const [showServiceList, setShowServiceList] = useState(false);
    const [serviceCategories, setserviceCategories] = useState([]);
    const [newServiceListing, setNewServiceListing] = useState({
        cleaner_id: profile_id,
        title:'',
        description:'',
        price:'',
        location:'',
        view_count: '0',
        listed_count: '0',
        service_categories_name:'',
        created_at : now
    })
    const [fieldErr, setFieldError] = useState({});
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [error, setError] = useState('');
    const [updateData, setUpdateData] = useState({
        id: null,
        cleaner_id: profile_id,
        title: '',
        description: '',
        price:'',
        location:'',
        view_count: '0',
        listed_count: '0',
        service_categories_name:''
      });

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);
    const [showSelectedListing, setShowSelectedListing] = useState(false);

    useEffect(() => {
        viewServiceListing();
        viewServiceCategories();
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

    const viewServiceCategories = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/serviceCategories`)
            
            const data = await response.json()
            setserviceCategories(data);

        } catch (error) {
            console.log(error);
            setServiceListing([]);
        }
    }

    const handleChange = () => {
        setError('');
        viewServiceListing();
        setShowServiceList(true);
    }
    const handleSearch = async (e) => {
        e.preventDefault();
        searchServiceListing();
        setShowServiceList(true);
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
    
            // Filter by cleaner_id and search term
            const filteredServices = servicesArray.filter(service => 
            service && 
            String(service.cleaner_id) === String(profile_id) &&
            service.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
    
            setServiceListing(filteredServices);
            setError('');
            

        } catch (error) {
            console.log(error);
            setError(error.message)
        }
    }

    const createServiceListing = async(e) => {
        setError('');

        console.log(newServiceListing)
        e.preventDefault();

        if (!newServiceListing.title && 
            !newServiceListing.description &&
            !newServiceListing.price &&
            !newServiceListing.location &&
            !newServiceListing.service_categories_name) {
            setError(
                "All fields are required"
            );
            setIsLoading(false);
            return;
        }

        const newError = {};
        if (!newServiceListing.title) newError.title = 'Title is required';
        if (!newServiceListing.description) newError.description = 'Description is required';
        if (!newServiceListing.price) newError.price = 'Price is required';
        if (!newServiceListing.location) newError.location = 'Location is required';
        if (!newServiceListing.service_categories_name) newError.service_categories_name = 'Category is required';

        if (Object.keys(newError).length > 0) {
            setFieldError(newError);
            return;
        }


        try {
            const response = await fetch('http://localhost:3000/api/serviceListing', {
                method: "POST",
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    cleaner_id: newServiceListing.cleaner_id,
                    title: newServiceListing.title,
                    description: newServiceListing.description,
                    price: newServiceListing.price,
                    location: newServiceListing.location,
                    view_count: newServiceListing.view_count,
                    listed_count: newServiceListing.listed_count,
                    service_categories_name: newServiceListing.service_categories_name,
                    created_at : newServiceListing.created_at

                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create service')
            }
            
            setShowCreateModal(false)
            setNewServiceListing({
                cleaner_id: profile_id,
                title:'',
                description:'',
                price:'',
                location:'',
                view_count: '0',
                listed_count: '0',
                service_categories_name:'',
                created_at : now
            })
            alert("Service Listing Created")
            setError('');

        } catch (error) {
            console.log(error);
        }
    }

    const handleInputChange = (e) => {  
        const { name, value } = e.target;
        setNewServiceListing(prev => ({...prev, [name]: value}));
        if (error[name]) setError(prev => ({ ...prev, [name]: '' }));
      };

    const updateServiceListing = async(e) => {
        setError('');
        e.preventDefault();

        try {

            const updatePayload = {};
            if (updateData.title) updatePayload.title = updateData.title;
            if (updateData.description) updatePayload.description = updateData.description;
            if (updateData.price) updatePayload.price = updateData.price;
            if (updateData.location) updatePayload.location = updateData.location;
            if (updateData.service_categories_name) updatePayload.service_categories_name = updateData.service_categories_name;

            const response = await fetch(`http://localhost:3000/api/serviceListing/${updateData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatePayload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update service')
            }
            
            setShowUpdateModal(false);
            viewServiceListing();
            alert('Service Listing updated successfully')
            setError('');
        } catch (error) {
            console.log(error);
        }
    }

    const handleUpdateButton = (service) => {
        setUpdateData({
            id: service.id,
            cleaner_id: service.cleaner_id,
            title: service.title,
            description: service.description,
            price: service.price,
            location: service.location,
            view_count: service.view_count,
            listed_count: service.listed_count,
            service_categories_name: service.service_categories_name
          });
        setShowUpdateModal(true);
    }

    const handleUpdateInputChange = (e) => {  
        const { name, value } = e.target;
        setUpdateData(prev => ({
          ...prev,
          [name]: value
        }));
      };

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
            alert('Service Listing deleted successfully')
        } catch (error) {
            console.error(error);
        }
    }

    const viewSpecifyListing = async (serviceId) => {
        console.log(serviceId)
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

    const handlePastServicePage = () => {
        navigate('/cleanerMatchHitory')
    }

    const handleProfileChange = (e) => {

        const selectedName = e.target.value;

            setNewServiceListing(prev => ({
            ...prev,
            service_categories_name: selectedName
            }));
    };

    const handleCloseModal = () => {
        setShowSelectedListing(false);
        setShowUpdateModal(false);
        setError('');
    };

    return (
        <>  
            <h2>Service Listing</h2>

            <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="create-button"
            >
            Create Service Listing
            </button>
            <button
                type="button"
                onClick={handlePastServicePage}
                className="create-button"
                style={{ marginLeft: '10px' }}
            >
            View Service Matches
            </button>
            
            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Create New Service</h3>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="close-button"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={createServiceListing}>
                            {error&& <div className="error-message">{error}</div>}
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={newServiceListing.title}
                                    onChange={handleInputChange}
                                    className={fieldErr.title ? 'error' : ''}
                                />
                                {fieldErr.title && <span className="field-error">{fieldErr.title}</span>}
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={newServiceListing.description}
                                    onChange={handleInputChange}
                                    className={fieldErr.description ? 'error' : ''}
                                    rows={4}
                                />
                                {fieldErr.description && <span className="field-error">{fieldErr.description}</span>}
                            </div>

                            <div className="form-group">
                                <label>Price</label>
                                <input
                                    type="text"
                                    name="price"
                                    value={newServiceListing.price}
                                    onChange={handleInputChange}
                                    className={fieldErr.price ? 'error' : ''}
                                />
                                {fieldErr.price && <span className="field-error">{fieldErr.price}</span>}
                            </div>

                            <div className="form-group">
                                <label>Location</label>
                               <input
                                    type="text"
                                    name="location"
                                    value={newServiceListing.location}
                                    onChange={handleInputChange}
                                    className={fieldErr.location ? 'error' : ''}
                                />
                                {fieldErr.location && <span className="field-error">{fieldErr.location}</span>}
                            </div>

                            <div className="form-group">
                                <label>Service Category</label>
                                    <select
                                        name="service_categories_name"
                                        value={newServiceListing.service_categories_name}
                                        onChange={handleProfileChange}
                                        required
                                    >
                                        {serviceCategories.map(serviceCategory => (
                                            <option key={serviceCategory.name} value={serviceCategory.name}>
                                                {serviceCategory.name}
                                            </option>
                                            ))}
                                    </select>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Creating..' : 'Create Service'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <button
                type="button"
                onClick={handleChange}
                className="create-button"
                style={{ marginLeft: '10px' }}
            >View Service Listing
            </button>
            <div className="search-container">
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
                    </form>
                </div>

                {error && <div className="error-message">{error}</div>}

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
                                            <button
                                                className="suspend"
                                                onClick={() => suspendServiceListing(service.id)}
                                            >
                                                Delete
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
              <p><strong>View Count:</strong> {selectedListing.view_count}</p>
              <p><strong>Listed Count:</strong> {selectedListing.listed_count}</p>
              <p><strong>Service Category name:</strong> {selectedListing.service_categories_name}</p>
            </div>
            
            <div className="form-actions">
                <button
                    className="view-button"
                    onClick={() => handleUpdateButton(selectedListing)}
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
                        <h2>Update Service</h2>
                        <button 
                            className="close-button"
                            onClick={handleCloseModal}
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={updateServiceListing}>
                        <div className="form-group">
                            <label>Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={updateData.title}
                                onChange={handleUpdateInputChange}

                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={updateData.description}
                                onChange={handleUpdateInputChange}
                                rows={4}
                            />
                        </div>

                        <div className="form-group">
                            <label>Price:</label>
                            <input
                                type="text"
                                name="price"
                                value={updateData.price}
                                onChange={handleUpdateInputChange}

                            />
                        </div>

                        <div className="form-group">
                            <label>Location:</label>
                            <input
                                type="text"
                                name="location"
                                value={updateData.location}
                                onChange={handleUpdateInputChange}

                            />
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <label>Service Category</label>
                                <select
                                    name="service_categories_name"
                                    value={newServiceListing.service_categories_name}
                                    onChange={handleUpdateInputChange}
                                    required
                                >
                                    {serviceCategories.map(serviceCategory => (
                                        <option key={serviceCategory.name} value={serviceCategory.name}>
                                            {serviceCategory.name}
                                        </option>
                                        ))}
                                </select>
                            {error.location && <span className="field-error">{error.location}</span>}
                        </div>

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
                                {isLoading ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
            </div>
    </>
    );
}