import React, { useState } from 'react';
import axios from 'axios';
import './Home.css'; // Optional for styling

const Home = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
    console.log('Redirecting to sign-up page');
  };

  return (
    <div className="home-container">
      <h1>Welcome to E-Bidding Story</h1>
      
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

/*
import React, { useState } from 'react';
import './Home.css'; // Optional: Create this for custom styles if needed.

const Home = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle login
  const handleLogin = (e) => {
    e.preventDefault();
    // You can add login logic here (e.g., make a request to your backend API)
    console.log('Logging in with', { username, password });

  };

  // Function to handle sign up
  const handleSignUp = () => {
    // Redirect to sign-up page or add your sign-up logic here
    console.log('Redirecting to sign-up page');
  };

  return (
    <div className="home-container">
      <h1>Welcome to E-Bidding Story</h1>
      
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