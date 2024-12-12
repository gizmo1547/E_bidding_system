/*
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

export default PlaceB;*/


/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlaceB.css'; // Import the CSS file

const PlaceB = ({ itemId }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBiddingClosed, setIsBiddingClosed] = useState(false);

  // Get the logged-in user's ID and token from localStorage
  const bidderID = localStorage.getItem('userID');
  const token = localStorage.getItem('token');  // JWT token from localStorage

  // State to track whether the user is logged in
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);

  // Check if the user is logged in
  useEffect(() => {
    if (!bidderID || !token) {
      setIsUserLoggedIn(false);  // User is not logged in
    }
  }, [bidderID, token]); // Only run when bidderID or token changes

  // Fetch item deadline to check if bidding is closed
  useEffect(() => {
    const checkBiddingStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/item/${itemId}`);
        const item = response.data.item;
        const currentTime = new Date();
        const deadline = new Date(item.Deadline);

        // Check if the current time is past the deadline
        if (currentTime > deadline) {
          setIsBiddingClosed(true);
        }
      } catch (error) {
        console.error("Error fetching item details:", error);
        setResponseMessage("Error checking bidding status.");
      }
    };

    checkBiddingStatus();
  }, [itemId]);  // Dependency array ensures the effect runs when itemId changes

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

  // Early return if the user is not logged in
  if (!isUserLoggedIn) {
    return <div>You must be logged in to place a bid.</div>;
  }

  return (
    <div>
      <h3>Place a Bid</h3>
      {isBiddingClosed ? (
        <div>Bidding has closed for this item.</div>
      ) : (
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
      )}

      {responseMessage && <div>{responseMessage}</div>}
    </div>
  );
};

export default PlaceB;*/


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlaceB.css'; // Import the CSS file

const PlaceB = ({ itemId }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBiddingClosed, setIsBiddingClosed] = useState(false);
  const [itemDeadline, setItemDeadline] = useState('');

  // Get the logged-in user's ID and token from localStorage
  const bidderID = localStorage.getItem('userID');
  const token = localStorage.getItem('token');  // JWT token from localStorage

  // State to track whether the user is logged in
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);

  // Check if the user is logged in
  useEffect(() => {
    if (!bidderID || !token) {
      setIsUserLoggedIn(false);  // User is not logged in
    }
  }, [bidderID, token]); // Only run when bidderID or token changes

  // Fetch item deadline to check if bidding is closed
  useEffect(() => {
    const checkBiddingStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/item/${itemId}`);
        const item = response.data.item;
        const currentTime = new Date();
        const deadline = new Date(item.Deadline);

        setItemDeadline(deadline); // Set the item Deadline

        // Check if the current time is past the deadline
        if (currentTime > deadline) {
          setIsBiddingClosed(true);
        }
      } catch (error) {
        console.error("Error fetching item details:", error);
        setResponseMessage("Error checking bidding status.");
      }
    };

    checkBiddingStatus();
  }, [itemId]);  // Dependency array ensures the effect runs when itemId changes

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

  // Early return if the user is not logged in
  if (!isUserLoggedIn) {
    return <div>You must be logged in to place a bid.</div>;
  }

  // Format the Deadline to a human-readable string (e.g., "December 10, 2024 at 10:00 AM")
  const formatDeadline = (deadline) => {
    if (!deadline) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
    return new Date(deadline).toLocaleString(undefined, options);
  };

  return (
    <div>
      <h3>Place a Bid</h3>
      
      {isBiddingClosed ? (
        <div>Bidding has closed for this item.</div>
      ) : (
        <>
          <div>
            <strong>Deadline for bids: </strong>
            {formatDeadline(itemDeadline)} {/* Display the formatted Deadline */}
          </div>

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
        </>
      )}

      {responseMessage && <div>{responseMessage}</div>}
    </div>
  );
};

export default PlaceB;

