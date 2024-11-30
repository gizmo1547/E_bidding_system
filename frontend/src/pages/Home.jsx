
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Optional for styling

const Home = () => {
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  // Function to navigate to the login page
  const handleLogin = () => {
    navigate('/login');
  };

  // Function to navigate to the registration (sign-up) page
  const handleSignUp = () => {
    navigate('/registration');
  };

  return (
    <div className="home-container">
      <h1>Welcome to E-Bidding Store</h1>
      <div className="buttons-container">
        <button className="login-button" onClick={handleLogin}>Login</button>
        <button className="signup-button" onClick={handleSignUp}>Sign Up</button>
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