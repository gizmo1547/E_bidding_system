// Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [userData, setUserData] = useState({});
  const [items, setItems] = useState([]);
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
      setItems(res.data.items); // Assuming the backend returns user's items
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
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome, {userData.Username}!</h2>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      {message && <p className="error">{message}</p>}
      <div className="account-info">
        <h3>Your Account Information:</h3>
        <p><strong>Role:</strong> {userData.Role}</p>
        <p><strong>Account Balance:</strong> ${userData.AccountBalance}</p>
        <p><strong>VIP Status:</strong> {userData.IsVIP ? 'Yes' : 'No'}</p>
        <p><strong>Average Rating:</strong> {userData.AverageRating}</p>
        <p><strong>Number of Transactions:</strong> {userData.NumberOfTransactions}</p>
      </div>
      <div className="user-actions">
        <h3>Your Actions:</h3>
        <button onClick={() => navigate('/deposit')}>Deposit Money</button>
        <button onClick={() => navigate('/withdraw')}>Withdraw Money</button>
        <button onClick={() => navigate('/list-item')}>List an Item/Service</button>
        <button onClick={() => navigate('/browse-items')}>Browse Items</button>
      </div>
      <div className="your-items">
        <h3>Your Listed Items/Services:</h3>
        {items.length > 0 ? (
          <ul>
            {items.map((item) => (
              <li key={item.ItemID}>
                <strong>{item.Name}</strong> - ${item.Price}
                {/* Optionally, add buttons to edit or remove the item */}
              </li>
            ))}
          </ul>
        ) : (
          <p>You have not listed any items/services yet.</p>
        )}
      </div>
      {/* Add more sections as needed */}
    </div>
  );
};

export default Dashboard;
