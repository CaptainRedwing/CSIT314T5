import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function SearchUser() { 
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [searchBy, setSearchBy] = useState('username');

  useEffect(() => {
    fetchAllUsers();
  }, []);

  
  const fetchAllUsers = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch("http://localhost:3000/api/userAdmin", { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError(error.message);
      console.error('Fetch users error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchAllUsers();
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const url = new URL("http://localhost:3000/api/userAdmin/search");
      url.searchParams.append(searchBy, searchTerm);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Search failed');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError("Search failed: " + error.message);
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewUser = (userId) => {
    navigate(`/userPage/${userId}`);
  };

  const handleSuspendUser = async (userId) => {
  
    try {
      const response = await fetch(`http://localhost:3000/api/userAdmin/${userId}`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to suspend user');
      }
  
      await fetchAllUsers();
      
      alert('User suspended successfully');
      
    } catch (error) {
      setError(error.message);
      console.error('Suspend user error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="search-container">
      <div className="search-controls">
      <form onSubmit={handleSearch}>
          <div className="search-options">
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className="search-select"
            >
              <option value="username">Username</option>
              <option value="role">Role</option>
            </select>
            
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search by ${searchBy}...`}
              className="search-input"
            />
          </div>
          
          <div className="search-buttons">
            <button type="submit" disabled={isLoading} className="search-button">
              {isLoading ? 'Searching...' : 'Search'}
            </button>
            
            <button 
              type="button" 
              onClick={fetchAllUsers}
              disabled={isLoading}
              className="refresh-button"
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <button 
                  className="view-button"
                  onClick={() => (handleViewUser(user.id))}
                  >View</button>
                  
                  <button 
                  className="suspend"
                  onClick={() => (handleSuspendUser(user.id))}
                  >Suspend</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}