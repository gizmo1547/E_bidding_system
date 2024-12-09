// AddMoney.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//import './AddMoney.css';

const AddMoney = () => {
  const [amountDeposit, setAmountDeposit] = useState('');
  const [amountWithdrawn, setAmountWithdrawn] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleDepositMoney = async (e) => {
    e.preventDefault();
    setMessage('');

    const token = localStorage.getItem('token');

    try {
      const res = await axios.post('http://localhost:8000/add-money', { amountDeposit }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setMessage('Funds added successfully!');
        // Optionally, redirect back to user home or refresh the page
        navigate('/user-home');
      }
    } catch (error) {
      console.error('Error adding money:', error);
      setMessage(error.response?.data?.message || 'Failed to add funds');
    }
  };

  const handleWithdrawMoney = async (e) => {
    e.preventDefault();
    setMessage('');

    const token = localStorage.getItem('token');

    try {
      const res = await axios.post('http://localhost:8000/withdraw-money', { amountWithdrawn }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setMessage('Funds withdrawn successfully!');
        // Optionally, redirect back to user home or refresh the page
        navigate('/user-home');
      }
    } catch (error) {
      console.error('Error adding money:', error);
      setMessage(error.response?.data?.message || 'Failed to add funds');
    }
  };

  return (
    <div className="add-money-container">
      <h2>Add Money to Your Account</h2>
      <form onSubmit={handleDepositMoney}>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            step="0.01"
            value={amountDeposit}
            onChange={(e) => setAmountDeposit(e.target.value)}
            required
          />
        </div>
        <button type="submit">Deposit Money</button>
      </form>
      <form onSubmit={handleWithdrawMoney}>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            step="0.01"
            value={amountWithdrawn}
            onChange={(e) => setAmountWithdrawn(e.target.value)}
            required
          />
        </div>
        <button type="submit">Withdraw Money</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddMoney;
