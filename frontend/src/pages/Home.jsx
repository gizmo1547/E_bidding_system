import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserHome.css'; 
import ItemList from './ItemList';

const Home = () => {
  const [userData, setUserData] = useState({});
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isChatMinimized, setIsChatMinimized] = useState(false);

  const navigate = useNavigate();

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

  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;  // Skip fetching user data if not logged in

      const res = await axios.get('http://localhost:8000/user-data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(res.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchCategories();
    fetchItems();
    fetchUserData();
  }, [fetchCategories, fetchItems, fetchUserData]);

  const handleLogin = () => {
    navigate('/login');
  };

const handleRegister = () => {
    navigate('/Registration');
  };
  const handleCategoryClick = (category) => {
    setSelectedCategory(category === 'More' ? null : category);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newUserMessage = { sender: 'user', text: userInput.trim() };
    setChatMessages((prev) => [...prev, newUserMessage]);
    setUserInput('');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:8000/bot',
        { message: userInput.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const botReply = { sender: 'bot', text: res.data.reply };
      setChatMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error('Error chatting with bot:', error);
      const botReply = { sender: 'bot', text: 'Sorry, something went wrong.' };
      setChatMessages((prev) => [...prev, botReply]);
    }
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
        <aside className="sidebar">
          <h3>Categories</h3>
          <ul>
            {categories.map((category, index) => (
              <li
                key={index}
                className={selectedCategory === category ? 'active' : ''}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </aside>

        <section className="items-section">
          <h3>{selectedCategory || 'All'} Items</h3>
          <ItemList items={items} />
        </section>
      </div>

      {/* Chat UI */}
      <div className={`chat-container ${isChatMinimized ? 'minimized' : ''}`}>
        <div className="chat-header">
          <span>Chat Assistant</span>
          <button 
            className="chat-toggle-btn" 
            onClick={() => setIsChatMinimized(!isChatMinimized)}
          >
            {isChatMinimized ? '▲' : '▼'}
          </button>
        </div>

        {!isChatMinimized && (
          <>
            <div className="chat-messages">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.sender}`}>
                  <strong>{msg.sender === 'user' ? 'You' : 'Bot'}: </strong>{msg.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="chat-input-form">
              <input
                type="text"
                placeholder="Ask me something..."
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          </>
        )}
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