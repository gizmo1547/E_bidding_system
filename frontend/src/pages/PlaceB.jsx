/*import React, { useState } from 'react';
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
*/
import React, { useState } from 'react';
import axios from 'axios';
import './PlaceB.css'; // Import the CSS file

const PlaceB = ({ itemId }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get the logged-in user's ID and token from localStorage
  const bidderID = localStorage.getItem('userID');
  const token = localStorage.getItem('token');  // JWT token from localStorage
  console.log("Bidder ID from localStorage:", bidderID); // Debugging step

  // Check if the user is logged in
  if (!bidderID || !token) {
    return <div>You must be logged in to place a bid.</div>;
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate bid amount
    if (!bidAmount || isNaN(bidAmount) || parseFloat(bidAmount) <= 0) {
      setResponseMessage('Please enter a valid bid amount.');
      return;
    }

    setIsLoading(true);
    setResponseMessage('');

    try {
      const bidData = {
        itemID: itemId,
        bidAmount: parseFloat(bidAmount),
        bidderID,
      };

      // Make the POST request to place the bid, sending the token for authentication
      const response = await axios.post('http://localhost:8000/api/placebid', bidData, {
        headers: {
          Authorization: `Bearer ${token}`,  // Add token in the Authorization header
        },
      });

      if (response.data.message === 'Bid placed successfully!') {
        setResponseMessage('Your bid has been placed successfully!');
      } else {
        setResponseMessage(response.data.message || 'Error placing the bid.');
      }
    } catch (error) {
      setResponseMessage('An error occurred. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3>Place a Bid</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="bidAmount">Bid Amount:</label>
        <input
          type="number"
          id="bidAmount"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          required
          min="0"
          step="any"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Placing Bid...' : 'Place Bid'}
        </button>
      </form>

      {responseMessage && <div>{responseMessage}</div>}
    </div>
  );
};

export default PlaceB;
