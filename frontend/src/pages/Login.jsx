// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation after login
import axios from 'axios';
import './Login.css'; // Optional for styling

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Reset error message before submitting

        try {
            const loginData = {
                username: username,
                password: password,
            };

            // Make API call to backend for login
            const res = await axios.post('http://localhost:8000/login', loginData);

            // Check if login is successful
            if (res.status === 200) {
                console.log('Login successful:', res.data);
                // Store token in localStorage or context
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('role', res.data.role);
                // Redirect to dashboard or another page after successful login
                if(res.data.role === 'SuperUser')
                {
                    navigate('/dashboard');
                }
                else
                {
                    navigate('/user-home');
                }
                
            }
        } catch (err) {
            console.error('Login failed:', err.response ? err.response.data : err.message);
            setErrorMessage(err.response?.data?.message || 'Invalid username or password');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div className="input-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {errorMessage && <p className="error">{errorMessage}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;

