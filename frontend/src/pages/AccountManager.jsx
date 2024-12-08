// AccountManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import './AccountManager.css';

const AccountManager = () => {
  const [userData, setUserData] = useState({});
  const [newEmail, setNewEmail] = useState('');
  const [message, setMessage] = useState('');

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/user-data', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(res.data.user);
        setNewEmail(res.data.user.Email);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:8000/update-email', { email: newEmail }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        setMessage('Email updated successfully!');
        setUserData({ ...userData, Email: newEmail });
      }
    } catch (error) {
      console.error('Error updating email:', error);
      setMessage(error.response?.data?.message || 'Failed to update email');
    }
  };

  return (
    <div className="account-manager-container">
      <h2>Account Manager</h2>
      <form onSubmit={handleUpdateEmail}>
        <div>
          <label>Username:</label>
          <input type="text" value={userData.Username} disabled />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update Email</button>
      </form>
      {message && <p>{message}</p>}
      <div>
          <label>First Name:</label>
          <input
            type="text"
          />
        </div>
      <div>
          <label>Last Name:</label>
          <input
            type="text"
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
          />
        </div>
        <div>
          <label>Country:</label>
          <input
            type="text"
          />
        </div>
        <div>
          <label>State:</label>
          <input
            type="text"
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
          />
        </div>
        <div>
          <label>Zip Code:</label>
          <input
            type="text"
          />
        </div>
        <div>
          <label>Address 2:</label>
          <input
            type="text"
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
          />
        </div>
        <button type="Submit">Edit Shipping Address</button>
    </div>
  );
};

export default AccountManager;