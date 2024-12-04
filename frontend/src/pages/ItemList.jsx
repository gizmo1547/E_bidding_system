
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ItemList.css'; // Import the CSS file

const ItemList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch items with their highest bid and image_url
    axios.get('http://localhost:8000/items-with-highest-bids')
      .then(response => {
        setItems(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching items:', error);
      });
  }, []);

  return (
    <div>
      <h2>Items for Bidding</h2>
      <ul>
        {items.map(item => (
          <li key={item.ItemID} className="item-card">
            <Link to={`/item/${item.ItemID}`} className="item-link">
              {/* Conditionally render image if available */}
              {item.image_url && (
                <div>
                  <img 
                    src={item.image_url}
                    alt={item.Name} 
                    className="item-image" 
                  />
                </div>
              )}
              
              <h3>{item.Title}</h3>
              <p>{item.Description}</p>
              <p>Starting Price: ${item.AskingPrice}</p>
              {/* Displaying the highest bid or a default message */}
              <p>
                Highest Bid: ${item.highest_bid || 'No bids yet'}
              </p>
              
              {/* You can add more item details here if needed */}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemList;

