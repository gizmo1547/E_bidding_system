// UserHome.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//import './UserHome.css';

const UserHome = () => {
  const [userData, setUserData] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Function to fetch user data from the backend
  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // If no token, redirect to login
        navigate('/login');
        return;
      }

      const res = await axios.get('http://localhost:8000/user-data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(res.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessage('Failed to load user data. Please try again.');
      // Optionally, redirect to login if unauthorized
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // Function to navigate to add money page
  const handleAddMoney = () => {
    navigate('/add-money');
  };

  // Function to navigate to account manager page
  const handleAccountManager = () => {
    navigate('/account-manager');
  };

  return (
    <div className="user-home-container">
      <h2>Welcome, {userData.Username}!</h2>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      {message && <p className="error">{message}</p>}
      <div className="account-info">
        <h3>Your Account Balance:</h3>
        <p>${userData.AccountBalance}</p>
      </div>
      <div className="user-actions">
        <button onClick={handleAddMoney}>Add Money</button>
        <button onClick={handleAccountManager}>Account Manager</button>
      </div>
    </div>
  );
};

export default UserHome;
