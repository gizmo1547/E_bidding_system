
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserHome.css'; 
import ItemList from './ItemList';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  // Fetch categories from the backend
  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8000/categories');
      const categoryNames = res.data.map((category) => category.CategoryName);
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
      setItems(res.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      setMessage('Failed to load items. Please try again.');
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, [fetchCategories, fetchItems]);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/registration');
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === 'More' ? null : category);
  };

  return (
    <div className="user-home-container">
      <header>
        <h1>E-Bidding Store</h1>
        <div className="user-info">
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleRegister}>Register</button>
        </div>
      </header>

      {message && <p className="error">{message}</p>}

      <div className="main-content">
       

        <section className="items-section">
          <h3>Welcome! Browse items across various categories and bid if you like.</h3>
          <h3>{selectedCategory || 'All'} Items</h3>
          <ItemList items={items} />
        </section>
      </div>
    </div>
  );
};

export default Home;


/*
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Change to useNavigate
import axios from 'axios';
import './Home.css'; // Optional for styling

const Home = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      username: username,
      password: password,
    };

    try {
      const res = await axios.post('http://localhost:8000/login', loginData);
      console.log('Login successful:', res.data);
      // Redirect or store token here
      // window.location.href = '/dashboard';
    } catch (err) {
      console.error('Login failed:', err.response ? err.response.data : err.message);
      alert('Invalid username or password');
    }
  };

  const handleSignUp = () => {
    navigate('/registration'); // Use navigate to redirect to the registration page
  };

  return (
    <div className="home-container">
      <h1>Welcome to E-Bidding Store</h1>
      
      <form onSubmit={handleLogin} className="login-form">
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="buttons">
          <button type="submit" className="login-button">Login</button>
          <button type="button" className="signup-button" onClick={handleSignUp}>Sign Up</button>
        </div>
      </form>
    </div>
  );
};

export default Home;
*/