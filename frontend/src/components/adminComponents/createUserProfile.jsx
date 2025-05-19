import React, { useState, useEffect } from "react";

export default function CreateUserProfile() { 

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name : '',
    description:'',
    is_active: true
  });
  const [userProfile, setUserProfile] = useState([]);

  
      useEffect(() => {
        const viewAllUserProfile = async () => {
            setIsLoading(true);
            setError('');
    
            try {
                const response = await fetch("http://localhost:3000/api/userProfile");
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
                const data = await response.json();
                
                if (!Array.isArray(data)) {
                    throw new Error("Expected array but got: " + typeof data);
                }
                
                setUserProfile(data);
            } catch (error) {
                setError(error.message);
                console.error('Fetch error:', error);
                setUserProfile([]);
            } finally {
                setIsLoading(false);
            }
        };
        viewAllUserProfile();
      }, []);


  const handleInputChange = (e) => {  
    const { name, value } = e.target;
    setNewUser(prev => ({...prev, [name]: value}));
    if (error[name]) setError(prev => ({ ...prev, [name]: '' }));
  };

  const createUserProfile = async(e) => {
    e.preventDefault();

    const newError = {};
    if (!newUser.name) newError.name = 'Name is required';
    if (!newUser.description) newError.description = 'Description is required';
    
    const profileTypeExists = userProfile.some(
        profile => profile.name.toLowerCase() === newUser.name.toLowerCase()
      );
  
      if (profileTypeExists) {
        setError({form: `Profile type "${newUser.name}" already exists`});
        return;
      }

    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/userProfile', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newUser.name,
          profile_type: newUser.profile_type,
          description: newUser.description,
          is_active: newUser.is_active
        })
      });

      if (!response.ok){
        const errorData = await response.json();
        console.error('Backend error:', errorData);
        throw new Error(errorData.message || 'Failed to create profile');
      }

      await response.json();
      
      setShowCreateModal(false);
      setNewUser({
        name : '',
        description:'',
        is_active: true
      });
      setError({});
      alert('User Profile created successfully')
      
    } catch (error) {
      setError({form: error.message});
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="admin-container">
      <button 
        onClick={() => setShowCreateModal(true)}
        className="create-button"
      >
        Create Profile User
      </button>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Create New Profile User</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="close-button"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={createUserProfile}>
              {error.form && <div className="error-message">{error.form}</div>}
              
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  className={error.name ? 'error' : ''}
                />
                {error.username && <span className="field-error">{error.name}</span>}
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                    name="description"
                    value={newUser.description}
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
                  {isLoading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}