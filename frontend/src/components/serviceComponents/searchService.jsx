import React, { useEffect, useState } from "react";
import { use } from "react";

export default function ServiceCategories() {
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [serviceCategories, setServiceCategories] = useState([]);
    const [showServiceList, setShowServiceList] = useState(false);
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

    const [updateServiceCategory, setUpdateServiceCategory] = useState({
        name:'',
        description:''
    })
    const [showUpdateModal, setShowUpdateModal] = useState(false);

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

            const response = await fetch(`http://localhost:3000/api/serviceCategories/${searchTerm}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
              });

            const data = await response.json();
            setServiceCategories(Array.isArray(data) ? data : [data]);
        } catch (error) {
            console.log(error);
        }
    }

    const createServiceCategories = async(e) => {
        e.preventDefault();

        const newError = {};
        if (!newServiceCategory.name) newError.name = 'Name is required';
        if (!newServiceCategory.description) newError.description = 'Description is required';

        if (Object.keys(newError).length > 0) {
            setError(newError);
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

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create service')
            }
            
            setShowCreateModal(false)
            setNewServiceCategory({
                name:'',
                description:''
            })

        } catch (error) {
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
            alert('Profile updated successfully')
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

    const suspendServiceCategories = async() => {

    }

    return (
        <div className="admin-container">
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
                            {error.form && <div className="error-message">{error.form}</div>}

                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newServiceCategory.name}
                                    onChange={handleInputChange}
                                    className={error.name ? 'error' : ''}
                                />
                                {error.name && <span className="field-error">{error.name}</span>}
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={newServiceCategory.description}
                                    onChange={handleInputChange}
                                    className={error.description ? 'error' : ''}
                                    rows={4}
                                />
                                {error.description && <span className="field-error">{error.description}</span>}
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
                                    {isLoading ? 'Creating..' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <button
                type="button"
                onClick={handleChange}
                className="refresh-button"
            >View Service Category
            </button>

            <div className="seach-controls">
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-options">
                        Service:
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by Service name..."
                            className="search-input"
                            style={{ marginLeft: '10px' }}
                        />

                        <div className="search-buttons">
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="search-button"
                            >
                                {isLoading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

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
                                            onClick={() => handleUpdateButton(category)}
                                        >
                                            Update
                                        </button>
                                        <button>delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
            </div>

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
                                onClick={()=>setShowUpdateModal(false)}
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
    );
}