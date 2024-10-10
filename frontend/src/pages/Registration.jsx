import React, { useState } from 'react';
import axios from 'axios';
import './Registration.css'; // Make sure this file exists

const Registration = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('User'); // Default role
    const [accountBalance, setAccountBalance] = useState(0);
    const [isVIP, setIsVIP] = useState(false);
    const [isSuspended, setIsSuspended] = useState(false);
    const [suspensionCount, setSuspensionCount] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [numberOfTransactions, setNumberOfTransactions] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Reset message before submitting

        try {
            const response = await axios.post('http://localhost:8000/users', {
                username,
                password,
                email,
                role,
                accountBalance,
                isVIP,
                isSuspended,
                suspensionCount,
                averageRating,
                numberOfTransactions,
                isActive
            });

            // Check response status for success
            if (response.status === 200) {
                setMessage('Registration successful!'); // Success message
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setMessage('Registration failed! Please try again.'); // Error message
        }
    };

    return (
        <div className="registration-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Role:</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                        {/* Add more roles as needed */}
                    </select>
                </div>
                <div>
                    <label>Account Balance:</label>
                    <input
                        type="number"
                        value={accountBalance}
                        onChange={(e) => setAccountBalance(Number(e.target.value))}
                    />
                </div>
                <div>
                    <label>Is VIP:</label>
                    <input
                        type="checkbox"
                        checked={isVIP}
                        onChange={(e) => setIsVIP(e.target.checked)}
                    />
                </div>
                <div>
                    <label>Is Suspended:</label>
                    <input
                        type="checkbox"
                        checked={isSuspended}
                        onChange={(e) => setIsSuspended(e.target.checked)}
                    />
                </div>
                <div>
                    <label>Suspension Count:</label>
                    <input
                        type="number"
                        value={suspensionCount}
                        onChange={(e) => setSuspensionCount(Number(e.target.value))}
                    />
                </div>
                <div>
                    <label>Average Rating:</label>
                    <input
                        type="number"
                        value={averageRating}
                        onChange={(e) => setAverageRating(Number(e.target.value))}
                    />
                </div>
                <div>
                    <label>Number of Transactions:</label>
                    <input
                        type="number"
                        value={numberOfTransactions}
                        onChange={(e) => setNumberOfTransactions(Number(e.target.value))}
                    />
                </div>
                <div>
                    <label>Is Active:</label>
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>} {/* Display message to user */}
        </div>
    );
};

export default Registration;
