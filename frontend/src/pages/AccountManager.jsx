// AccountManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import './AccountManager.css';

const AccountManager = () => {
  const [userData, setUserData] = useState({});
  const [newEmail, setNewEmail] = useState('');
  const [message, setMessage] = useState('');
  const [newFirst, setFirst] = useState('');
  const [newLast, setLast] = useState('');
  const [newAddress, setAddress] = useState('');
  const [newZip, setZip] = useState('');
  const [newCity, setCity] = useState('');
  const [newState, setState] = useState('');
  const [newCountry, setCountry] = useState('');
  const [newPhoneNumber, setPhoneNumber] = useState('');


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
  const handleDetails = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:8000/update-address', { firstName: newFirst, lastName: newLast, address: newAddress, zip: newZip, city: newCity, state: newState, country: newCountry, phoneNumber: newPhoneNumber }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        setMessage('Details updated successfully!');
        setUserData({ ...userData, First: newFirst, Last: newLast, Address: newAddress, Zip: newZip, City: newCity, State: newState, country: newCountry, PhoneNumber: newPhoneNumber});
      }
    } catch (error) {
      console.error('Error updating Details:', error);
      setMessage(error.response?.data?.message || 'Failed to update Details');
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
      <form onSubmit={handleDetails}>
        <div>
          <label>FirstName:</label>
          <input
            type="firstName"
            value={newFirst}
            onChange={(e) => setFirst(e.target.value)}
            required
          />
        </div>
        <div>
          <label>LastName:</label>
          <input
            type="lastName"
            value={newLast}
            onChange={(e) => setLast(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="address"
            value={newAddress}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Zip Code:</label>
          <input
            type="zipCode"
            value={newZip}
            onChange={(e) => setZip(e.target.value)}
            required
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="city"
            value={newCity}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div>
          <label>State:</label>
          <input
            type="state"
            value={newState}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Country:</label>
          <input
            type="country"
            value={newCountry}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="phoneNumber"
            value={newPhoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update Details</button>
      </form>
      <button type="submit">Sell Item</button>
    </div>
  );
};

export default AccountManager;


