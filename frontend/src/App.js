import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Users from "./pages/Users";
import Add from "./pages/Add";
import Update from "./pages/Update";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import PrivateRoute from './pages/PrivateRoute';
import Dashboard from './pages/Dashboard';

function App()
{
  return (
    <div className="App">
      <BrowserRouter>
       <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/users" element={<Users/>}/>
        <Route path="/add" element={<Add/>}/>
        <Route path="/update" element={<Update/>}/>
        <Route path="/registration" element={<Registration/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/privateroute" element={<PrivateRoute/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
       </Routes>
      
      </BrowserRouter>
    </div>
  );
}


  export default App;




/*
import React, { useState } from 'react';
import logo from './logo.svg';  // Use your own logo if you have one
import './App.css';
import {
  BrowserRouter,
  Routers,
  Route,
} from "react-router-dom";

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Here, add logic to handle login
    console.log('Logging in with', { username, password });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
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

          <button type="submit" className="login-button">Login</button>
        </form>
      </header>
    </div>
  );
}

export default App;
*/
/*
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/