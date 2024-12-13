import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyItems.css';

const MyItems = () => {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/my-items', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(res.data);
      } catch (error) {
        console.error('Error fetching items:', error);
        setMessage('Failed to load your items. Please try again later.');
      }
    };

    fetchMyItems();
  }, []);

  return (
    <div className="my-items-container">
      <h2>My Items</h2>
      {message && <p className="error-message">{message}</p>}
      <div className="items-grid">
        {items.map((item) => (
          <div key={item.ItemID} className="item-card">
            <img src={item.image_url} alt={item.Title} className="item-image" />
            <h3>{item.Title}</h3>
            <p>{item.Description}</p>
            <p><strong>Price:</strong> ${item.AskingPrice}</p>
            <p><strong>Status:</strong> {item.Status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyItems;
