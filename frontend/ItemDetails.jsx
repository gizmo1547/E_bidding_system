import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PlaceB from './PlaceB'; // Import PlaceB component

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
    <div>
      <h1>Item Details</h1>
      <div>
        <h2>{item.Name}</h2>
        <p>{item.Description}</p>
        <p>Starting Price: ${item.StartingPrice}</p>
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

      <PlaceB itemId={itemId} />
    </div>
  );
};

export default ItemDetails;
