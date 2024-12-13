
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserHome.css'; // Import your styles
import ItemList from './ItemList'; // Import the ItemList component

const UserHome = () => {
  const [userData, setUserData] = useState({});
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]); // Categories state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [items, setItems] = useState([]); // Define the 'items' state here
  const navigate = useNavigate();

  // Fetch user data from the backend
  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Redirect to login if no token
        return;
      }

      const res = await axios.get('http://localhost:8000/user-data', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(res.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessage('Failed to load user data. Please try again.');
      if (error.response && error.response.status === 401) {
        navigate('/login'); // Redirect to login if unauthorized
      }
    }
  }, [navigate]);

  // Fetch categories from the backend
  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8000/categories');
      const categoryNames = res.data.map(category => category.CategoryName);
      setCategories(categoryNames);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setMessage('Failed to load categories. Please try again.');
    }
  }, []);

  // Fetch items based on selected category
  const fetchItems = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8000/items', {
        params: selectedCategory ? { category: selectedCategory } : {},
      });
      setItems(res.data); // Update the 'items' state here
    } catch (error) {
      console.error('Error fetching items:', error);
      setMessage('Failed to load items. Please try again.');
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchUserData();
    fetchCategories();
    fetchItems();
  }, [fetchUserData, fetchCategories, fetchItems]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // Function to handle category selection
  const handleCategoryClick = (category) => {
    setSelectedCategory(category === 'More' ? null : category);
  };

  return (
    <div className="user-home-container">
      <header>
        <h1>E-Bidding Store</h1>
        <div className="user-info">
          <span>Welcome, {userData.Username}!</span>
          <span>Balance: ${userData.AccountBalance?.toFixed(2) || '0.00'}</span>
          <button onClick={() => navigate('/add-money')}>Add Money</button>
          <button onClick={() => navigate('/account-manager')}>Account Manager</button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {message && <p className="error">{message}</p>}

      <div className="main-content">
     
       

        <section className="items-section">
          <h3>{selectedCategory || 'All'} Items</h3>
          {/* Embed ItemList as a section */}
         <ItemList /> {/* This will render your ItemList component */}
        </section>
      </div>
    </div>
  );
}; 

export default UserHome; 

