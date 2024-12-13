

/*import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PlaceB from './PlaceB'; // Import PlaceB component
import './ItemDetails.css'; // Import the CSS file

const ItemDetails = () => {
  const { itemId } = useParams(); // Get itemId from the route parameter
  const [item, setItem] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/item/${itemId}`);
        setItem(response.data.item);
        setBids(response.data.bids);
        setLoading(false);
      } catch (err) {
        setError('Error fetching item details');
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="item-details-container">
      <div className="item-details">
        <h1>Item Details</h1>
        <div>
          <img 
            src={item.image_url}
            alt={item.Name} 
            className="item-image" 
          />
        </div>
        <h2>{item.Name}</h2>
        <p>{item.Description}</p>
        <p>Starting Price: ${item.AskingPrice}</p>
        <p>Status: {item.Status}</p>

        <h3>Bids</h3>
        <ul>
          {bids.map((bid) => (
            <li key={bid.BidID}>
              {bid.BidderName} placed a bid of ${bid.BidAmount} on {new Date(bid.BidDate).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
*/
     // {/* PlaceB component for placing a bid */}
 /*     <div className="placebid-section-container">
        <PlaceB itemId={itemId} />
      </div>
    </div>
  );
};

export default ItemDetails;*/


/*

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PlaceB from './PlaceB'; // Import PlaceB component
import './ItemDetails.css'; // Import the CSS file

const ItemDetails = () => {
  const { itemId } = useParams(); // Get itemId from the route parameter
  const [item, setItem] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buyerName, setBuyerName] = useState(''); // State to store the buyer's name

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/item/${itemId}`);
        setItem(response.data.item);
        setBids(response.data.bids);
        setLoading(false);
      } catch (err) {
        setError('Error fetching item details');
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemId]);

  const acceptBid = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/item/${itemId}/accept-bid`);
      alert('Transaction successful: ' + response.data.message);

      // Set the buyer's name after accepting the bid
      setBuyerName(response.data.transaction.BuyerName); // Set the buyer name from the response
    } catch (err) {
      alert('Error accepting bid: ' + err.response.data.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="item-details-container">
      <div className="item-details">
        <h1>Item Details</h1>
        <div>
          <img 
            src={item.image_url}
            alt={item.Title} 
            className="item-image" 
          />
        </div>
        <h2>{item.Title}</h2>
        <p>{item.Description}</p>
        <p>Starting Price: ${item.AskingPrice}</p>
        <p>Status: {item.Status}</p>

        <h3>Bids</h3>
        <ul>
          {bids.map((bid) => (
            <li key={bid.BidID}>
              {bid.BidderName} placed a bid of ${bid.BidAmount} on {new Date(bid.BidDate).toLocaleString()}
            </li>
          ))}
        </ul>
*/
    //    {/* Render the PlaceB component for placing a bid */}
   /*     <div className="placebid-section-container">
          <PlaceB itemId={itemId} />
        </div>

    */  //  {/* Add button to accept highest bid */}
   //     <button onClick={acceptBid}>Accept Highest Bid</button>

     //   {/* Display the buyer's name if the bid was accepted */}
  //      {buyerName && (
   //       <div>
     //       <h3>Buyer: {buyerName}</h3> {/* Display the buyer's name */}
   /*      </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetails;

*/

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PlaceB from './PlaceB'; // Import PlaceB component
import './ItemDetails.css'; // Import the CSS file

const ItemDetails = () => {
  const { itemId } = useParams(); // Get itemId from the route parameter
  const [item, setItem] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buyerName, setBuyerName] = useState(''); // State to store the buyer's name
  const [transactionDetails, setTransactionDetails] = useState(null); // State to store transaction details

  useEffect(() => {
    // Fetch item details
    const fetchItemDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/item/${itemId}`);
        setItem(response.data.item);
        setBids(response.data.bids);
        setLoading(false);
      } catch (err) {
        setError('Error fetching item details');
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemId]);

  useEffect(() => {
    // Fetch transaction details if item has been sold
    const fetchTransactionDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/item/${itemId}/transaction-details`);
        setTransactionDetails(response.data.transaction); // Set transaction details
      } catch (err) {
        console.error('Error fetching transaction details:', err);
      }
    };

    if (item && item.Status === 'Sold') {
      fetchTransactionDetails();
    }
  }, [itemId, item]);

  const acceptBid = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/item/${itemId}/accept-bid`);
      alert('Transaction successful: ' + response.data.message);

      // Set the buyer's name after accepting the bid
      setBuyerName(response.data.transaction.BuyerName); // Set the buyer name from the response
    } catch (err) {
      alert('Error accepting bid: ' + err.response.data.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="item-details-container">
      <div className="item-details">
        <h1>Item Details</h1>
        <div>
          <img 
            src={item.image_url}
            alt={item.Title} 
            className="item-image" 
          />
        </div>
        <h2>{item.Title}</h2>
        <p>{item.Description}</p>
        <p>Starting Price: ${item.AskingPrice}</p>
        <p>Status: {item.Status}</p>

        <h3>Bids</h3>
        <ul>
          {bids.map((bid) => (
            <li key={bid.BidID}>
              {bid.BidderName} placed a bid of ${bid.BidAmount} on {new Date(bid.BidDate).toLocaleString()}
            </li>
          ))}
        </ul>

        {/* Render the PlaceB component for placing a bid */}
        <div className="placebid-section-container">
          <PlaceB itemId={itemId} />
        </div>

        {/* Add button to accept highest bid */}
        <button onClick={acceptBid}>Accept Highest Bid</button>

        {/* Display the buyer's name if the bid was accepted */}
        {buyerName && (
          <div>
            <h3>Buyer: {buyerName}</h3> {/* Display the buyer's name */}
          </div>
        )}

        {/* Display transaction details if the item has been sold */}
        {transactionDetails && (
          <div>
            <h3>Transaction Details</h3>
            <p>Seller: {transactionDetails.SellerName}</p>
            <p>Buyer: {transactionDetails.BuyerName}</p>
            <p>Amount: ${transactionDetails.Amount}</p>
            <p>Transaction Date: {new Date(transactionDetails.TransactionDate).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetails;

