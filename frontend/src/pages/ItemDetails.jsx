/*import React, { useState, useEffect } from 'react';
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

      <PlaceB itemId={itemId} />
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

      {/* PlaceB component for placing a bid */}
      <div className="placebid-section-container">
        <PlaceB itemId={itemId} />
      </div>
    </div>
  );
};

export default ItemDetails;
