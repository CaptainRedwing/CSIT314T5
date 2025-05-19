import React, { useState, useEffect } from "react";

export default function CreateUserAccount() { 

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErr, setFieldError] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const now = new Date();
  const [newUser, setNewUser] = useState({
    username : '',
    email:'',
    password: '',
    confirmPassword: '',
    profile_id:'',
    is_active:true,
    time_stamp: now
  });


  const [profiles, setProfiles] = useState([]);

      useEffect(() => {

        const viewAllUserAccount = async () => {
          try {
            const response = await fetch("http://localhost:3000/api/userProfile", {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' }
            });
        
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
        
            const data = await response.json();
            const activeProfiles = data.filter(profile => profile.is_active === true);
            
            setProfiles(activeProfiles);

            if (activeProfiles.length > 0) {
              setNewUser(prev => ({
                ...prev,
                profile_id: activeProfiles[0].id
              }));
            }
            setError(''); // Clear errors on success
          } catch (error) {
            console.error('Error fetching profiles:', error);
            setError(prev => ({ ...prev, profileError: error.message }));
          }
        };

        // const viewAllUserAccount = async () => {
        //   try {
        //     const response = await fetch("http://localhost:3000/api/login/roles", {
        //       method: 'GET',
        //       headers: { 'Content-Type': 'application/json' }
        //     });

        //     if (!response.ok) {
        //       const errorData = await response.json();
        //       throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        //     }
        
        //     const data = await response.json();
        //     console.log(data)
        //     const arrayData = Array.isArray(data) ? data : [data].filter(Boolean)
        //     const activeProfiles = arrayData.filter(profile => profile.is_active === true);

        //     if (activeProfiles.length > 0) {
        //       setNewUser(prev => ({
        //         ...prev,
        //         profile_id: activeProfiles[0].id
        //       }));
        //     }
        //     setError(''); // Clear errors on success
            
        //     setProfiles(activeProfiles);

        //   } catch (error) {
        //     console.error('Error fetching profiles:', error);
        //     setError(error.message);
        //   }
        // }

        viewAllUserAccount();
      }, []);


  const handleInputChange = (e) => {  
    const { name, value } = e.target;
    setNewUser(prev => ({...prev, [name]: value}));
    if (error[name]) setError(prev => ({ ...prev, [name]: '' }));
  };

  const validateEmail = (email) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return emailRegex.test(email);
  };

  const createUserAccount = async(e) => {
    e.preventDefault();

    setError('')
    setFieldError({})

    if (!newUser.username && 
            !newUser.email &&
            !newUser.password
        ) {
            setError(
                "Please fill in all required fills"
            );
            setIsLoading(false);
            return;
        }

    const newError = {};
    if (!newUser.username) newError.username = 'Username is required';
    if (!newUser.email.trim()) {
      newError.email = 'Email is required';
    } else if (!validateEmail(newUser.email)) {
      newError.email = 'Please enter a valid Gmail address';
    }
    if (!newUser.password) newError.password = 'Password is required';
    if (newUser.password !== newUser.confirmPassword) {
      newError.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newError).length > 0) {
      setFieldError(newError);
      return;
    }

    console.log(newUser.profile_id)
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/userAdmin', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{
          username: newUser.username,
          email: newUser.email,
          password: newUser.password,
          profile_id: newUser.profile_id,
          is_active: newUser.is_active,
          time_stamp: newUser.time_stamp
        }])
      });

      const errorData = await response.json();

      if (response.status === 400){
        throw new Error(errorData.message || 'Username alr exsits');
      } else if(!response.ok) {
        throw new Error('Failed to create user');
      }
      
      setShowCreateModal(false);
      setNewUser({
        useraccount : '',
        email:'',
        password: '',
        confirmPassword: '',
        profile_id:'',
        is_active: true,
        time_stamp: now
      });
      setError('');
      alert('User Account Successfully Created')
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileChange = (e) => {

    const selectedId = e.target.value;

    setNewUser(prev => ({
      ...prev,
      profile_id: selectedId
    }));
  };

  return (
    <div className="admin-container">
      <button 
        onClick={() => setShowCreateModal(true)}
        className="create-button"
      >
        Create User Account
      </button>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Create New User</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="close-button"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={createUserAccount}>
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={newUser.username}
                  onChange={handleInputChange}
                  className={fieldErr.username ? 'error' : ''}
                />
                {fieldErr.username && <span className="field-error">{fieldErr.username}</span>}
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className={fieldErr.email ? 'error' : ''}
                />
                {fieldErr.email && <span className="field-error">{fieldErr.email}</span>}
              </div>

          <div className="form-group">
          <label>Account Type</label>
          <select
            name="profile_id"
            value={newUser.profile_id}
            onChange={handleProfileChange}
            required
          >
            {profiles.map(profiles => (
                <option key={profiles.id} value={profiles.id}>
                    {profiles.name}
                </option>
                  ))}
          </select>
        </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  className={fieldErr.password ? 'error' : ''}
                />
                {fieldErr.password && <span className="field-error">{fieldErr.password}</span>}
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={newUser.confirmPassword}
                  onChange={handleInputChange}
                  className={fieldErr.confirmPassword ? 'error' : ''}
                />
                {fieldErr.confirmPassword && (
                  <span className="field-error">{fieldErr.confirmPassword}</span>
                )}
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