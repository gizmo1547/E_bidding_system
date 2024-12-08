import React, { useState } from 'react';
import axios from 'axios';
import './PlaceB.css'; // Import the CSS file

const PlaceB = ({ itemId }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [bidder, setBidder] = useState(''); // Store bidder's name
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Handle bid amount input
  const handleBidAmountChange = (e) => {
    setBidAmount(e.target.value);
  };

  // Handle bidder name input
  const handleBidderChange = (e) => {
    setBidder(e.target.value);
  };

  // Handle form submission to place the bid
  const handlePlaceBid = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!bidder || !bidAmount || bidAmount <= 0) {
      setError('Please enter a valid bidder name and bid amount.');
      setMessage('');
      return;
    }

    try {
      // Construct the request payload
      const bidData = {
        item_id: itemId,
        bidder,
        amount: bidAmount,
        user_id: 1, // Hardcoded for now; replace with actual user ID
      };

      // Send POST request to the backend
      const response = await axios.post('http://localhost:8000/bids', bidData);

      // Handle successful bid placement
      setMessage('Bid placed successfully!');
      setError('');
      setBidAmount('');
      setBidder(''); // Reset fields after successful bid
    } catch (err) {
      // Handle error during bid placement
      setError('Failed to place bid. Please try again.');
      setMessage('');
    }
  };

  return (
    <div>
      <h3>Place Your Bid</h3>
      <form onSubmit={handlePlaceBid}>
        <div>
          <label htmlFor="bidder">Bidder Name</label>
          <input
            type="text"
            id="bidder"
            value={bidder}
            onChange={handleBidderChange}
            required
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label htmlFor="bidAmount">Bid Amount ($)</label>
          <input
            type="number"
            id="bidAmount"
            value={bidAmount}
            onChange={handleBidAmountChange}
            min="0"
            step="0.01"
            required
            placeholder="Enter your bid amount"
          />
        </div>

        <button type="submit">Place Bid</button>
      </form>

      {message && <div style={{ color: 'green' }}>{message}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default PlaceB;
/*
import React, { useState } from 'react';
import axios from 'axios';

const PlaceB = ({ itemId }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [bidder, setBidder] = useState(''); // Store bidder's name
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // To manage submit state

  // Handle bid amount input
  const handleBidAmountChange = (e) => {
    setBidAmount(e.target.value);
  };

  // Handle bidder name input
  const handleBidderChange = (e) => {
    setBidder(e.target.value);
  };

  // Handle form submission to place the bid
  const handlePlaceBid = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!bidder || !bidAmount || bidAmount <= 0) {
      setError('Please enter a valid bidder name and bid amount.');
      setMessage('');
      return;
    }

    setIsSubmitting(true); // Start submitting

    try {
      // Construct the request payload
      const bidData = {
        item_id: itemId,
        bidder_name: bidder,
        bid_amount: bidAmount,
        user_id: 1, // Hardcoded for now; replace with actual user ID
      };

      // Send POST request to the backend
      const response = await axios.post('http://localhost:8000/bids', bidData);

      // Handle successful bid placement
      if (response.status === 200) {
        setMessage('Bid placed successfully!');
        setError('');
        setBidAmount('');
        setBidder(''); // Reset fields after successful bid
      }
    } catch (err) {
      // Handle error during bid placement
      setError('Failed to place bid. Please try again.');
      setMessage('');
    } finally {
      setIsSubmitting(false); // Stop submitting
    }
  };

  return (
    <div className="placebid-section">
      <h3>Place Your Bid</h3>
      <form onSubmit={handlePlaceBid}>
        <div>
          <label htmlFor="bidder">Bidder Name</label>
          <input
            type="text"
            id="bidder"
            value={bidder}
            onChange={handleBidderChange}
            required
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label htmlFor="bidAmount">Bid Amount ($)</label>
          <input
            type="number"
            id="bidAmount"
            value={bidAmount}
            onChange={handleBidAmountChange}
            min="0"
            step="0.01"
            required
            placeholder="Enter your bid amount"
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Placing Bid...' : 'Place Bid'}
        </button>
      </form>

      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default PlaceB;
*/
