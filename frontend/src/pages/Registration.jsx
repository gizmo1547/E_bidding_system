
// Registration.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Registration.css'; // Ensure this file exists
import { useNavigate } from 'react-router-dom';

const Registration = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [question, setQuestion] = useState({});
    const [userAnswer, setUserAnswer] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        generateQuestion();
    }, []);

    const generateQuestion = async () => {
        try {
            const res = await axios.get('http://localhost:8000/generate-question');
            setQuestion(res.data);
        } catch (error) {
            console.error('Error generating question:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Reset message before submitting

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        let correctAnswer;

        switch (question.operator) {
            case '+':
                correctAnswer = question.num1 + question.num2;
                break;
            case '-':
                correctAnswer = question.num1 - question.num2;
                break;
            case '*':
                correctAnswer = question.num1 * question.num2;
                break;
            default:
                correctAnswer = null;
        }

        try {
            const response = await axios.post('http://localhost:8000/users', {
                username,
                password,
                email,
                userAnswer,
                correctAnswer
            });

            // Check response status for success
            if (response.status === 200) {
                setMessage('Registration successful!');
                // Redirect to login page after successful registration
                navigate('/login');
            }
        } catch (error) {
            console.error('Error during registration:', error.response ? error.response.data : error.message);
            setMessage(error.response?.data?.message || 'Registration failed! Please try again.');
            // Generate a new question in case of failure
            generateQuestion();
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
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>
                        Arithmetic Question: What is {question.num1} {question.operator} {question.num2}?
                    </label>
                    <input
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
                <a href="/login">Already have an account? Login here</a>
            </form>
            {message && <p>{message}</p>} {/* Display message to user */}
        </div>
    );
};

export default Registration;
