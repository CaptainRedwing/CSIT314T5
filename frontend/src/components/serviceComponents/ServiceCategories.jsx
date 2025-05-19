import React, { useEffect, useState } from "react";
import { use } from "react";

export default function ServiceCategories() {
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [serviceCategories, setServiceCategories] = useState([]);
    const [showServiceList, setShowServiceList] = useState(false);
    const [fieldErr, setFieldError] = useState({});
    const [newServiceCategory, setNewServiceCategory] = useState({
        name:'',
        description:''
    })
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [error, setError] = useState('');
    const [updateData, setUpdateData] = useState({
        id: null,
        name: '',
        description: ''
      });

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedCategory, setSelectedCateogry] = useState(null);
    const [showSelectedCategory, setShowSelectedCategory] = useState(false);

    useEffect(() => {
        viewServiceCategories();
    }, []);

    const viewServiceCategories = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/serviceCategories')
            
            const data = await response.json()
            setServiceCategories(data);
            console.log(data)
        } catch (error) {
            console.log(error);
            setServiceCategories([]);
        }
    }

    const handleChange = () => {
        viewServiceCategories();
        setShowServiceList(true);
    }
    const handleSearch = async (e) => {
        e.preventDefault();
        searchServiceCategories();
    };

    const searchServiceCategories = async() => {
        try {

            const response = await fetch(`http://localhost:3000/api/serviceCategories/search/${searchTerm}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
              });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.message || 'No Service Category Found');
            }

            setServiceCategories(Array.isArray(data) ? data : [data]);
            setError('');
            setShowServiceList(true);
        } catch (error) {
            setError(error.message);
            console.log(error);
        }
    }

    const createServiceCategories = async(e) => {
        e.preventDefault();

        if (!newServiceCategory.name && !newServiceCategory.description) {
            setError('Category name and description is required');
            return;
            }

        const newError = {};
        if (!newServiceCategory.name) newError.name = 'Category Name is required';
        if (!newServiceCategory.description) newError.description = 'Description is required';

        if (Object.keys(newError).length > 0) {
            setFieldError(newError);
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/serviceCategories', {
                method: "POST",
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    name: newServiceCategory.name,
                    description: newServiceCategory.description
                })
            });

            const data = await response.json()

            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error(data.message || 'Duplicate Category Name');
                } else if (response.status === 401) {
                    throw new Error(data.message || 'Invalid Category name and description is required');
                }
            }
            
            setShowCreateModal(false)
            setNewServiceCategory({
                name:'',
                description:''
            })
            alert('Service Category Created')
        } catch (error) {
            setError(error.message)
            console.log(error);
        }
    }

    const handleInputChange = (e) => {  
        const { name, value } = e.target;
        setNewServiceCategory(prev => ({...prev, [name]: value}));
        if (error[name]) setError(prev => ({ ...prev, [name]: '' }));
      };

    const updateServiceCategories = async(e) => {
        e.preventDefault();

        try {

            const usernameExists = serviceCategories.some(
                service => service.name === updateData.name
            );
      
            if (usernameExists) {
                setError('Name is already in use');
                return
            }

            const updatePayload = {};
            if (updateData.name) updatePayload.name = updateData.name;
            if (updateData.description) updatePayload.description = updateData.description;

            const response = await fetch(`http://localhost:3000/api/serviceCategories/${updateData.id}`, {
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
            alert('Service Category updated successfully')
        } catch (error) {
            console.log(error);
        }
    }

    const handleUpdateButton = (category) => {
        setUpdateData({
            id: category.id,
            name: category.name,
            description: category.description
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

    const suspendServiceCategories = async(serviceId) => {
        if (!window.confirm('Are you sure you want to suspend this service?')) return;

        try {
            const response = await fetch(`http://localhost:3000/api/serviceCategories/${serviceId}`, {
                method:'DELETE',
                headers: {'Content-Type':'application/json'}
            });

            if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to suspend user');
            }

            await viewServiceCategories();
            alert('Service category deleted successfully')
        } catch (error) {
            console.error(error);
        }
    }

    const handleCloseModal = () => {
        setShowSelectedCategory(false);
        setShowUpdateModal(false);
        setError('');
    };

    const viewSpecifyCategory = async (categoryId) => {
        setIsLoading(true);
        try {
        const response = await fetch(`http://localhost:3000/api/serviceCategories/${categoryId}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch service category details');
        }
        
        const userData = await response.json();
        setSelectedCateogry(userData);
        setShowSelectedCategory(true);
        
        } catch (error) {
        setError(error.message);
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <>
            <h2>Service Category</h2>

            <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="create-button"
            >
            Create Category
            </button>
            
            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Create New Service Category</h3>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="close-button"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={createServiceCategories}>
                            {error && <div className="error-message">{error}</div>}

                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newServiceCategory.name}
                                    onChange={handleInputChange}
                                    className={fieldErr.name ? 'Required' : ''}
                                />
                                {fieldErr.name && <span className="field-error">{fieldErr.name}</span>}
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={newServiceCategory.description}
                                    onChange={handleInputChange}
                                    className={fieldErr.description ? 'Required' : ''}
                                    rows={4}
                                />
                                {fieldErr.description && <span className="field-error">{fieldErr.description}</span>}
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
            >View Service Category
            </button>
            <div className="search-container">
                <div className="search-controls">
                    <form onSubmit={handleSearch}>
                        <div className="search-options">
                        <span className="search-label">Service:</span>
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
                                <th>Service Category</th>
                                <th>Description</th>
                                {/* <th>Status</th> */}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        {showServiceList && (
                            <tbody>
                                {serviceCategories.map((category) => (
                                    <tr key={category.id} className="profile-card">
                                        <td>{category.name}</td>
                                        <td>{category.description}</td>
                                        {/* <td>{category.status}</td> */}
                                        <td>
                                        <button 
                                            className="view-button"
                                            onClick={() => viewSpecifyCategory(category.id)}
                                        >
                                            View
                                        </button>
                                            <button
                                                className="suspend"
                                                onClick={() => suspendServiceCategories(category.id)}
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
        {showSelectedCategory && selectedCategory && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Service Category</h2>
                <button 
                    className="close-button"
                    onClick={handleCloseModal}
                >
                    ×
                </button>
            </div>
            
            <div className="user-info">
              <p><strong>Name:</strong> {selectedCategory.name}</p>
              <p><strong>Description:</strong> {selectedCategory.description}</p>
            </div>
            
            <div className="form-actions">
                <button
                    className="view-button"
                    onClick={() => handleUpdateButton(selectedCategory)}
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
                        <h2>Update Service Category</h2>
                        <button 
                            className="close-button"
                            onClick={() => setShowUpdateModal(false)}
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={updateServiceCategories}>
                        <div className="form-group">
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={updateData.name}
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

                        {error && <div className="error-message">{error}</div>}

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