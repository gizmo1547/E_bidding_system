
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ItemList.css'; // Import the CSS file

const ItemList = () => {
  // State for items, selected category, and available categories
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch categories when the component mounts
  useEffect(() => {
    axios.get('http://localhost:8000/categories') // Assume this endpoint returns the list of categories
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching categories:', error);
      });
  }, []);

  // Fetch items when the category changes
  useEffect(() => {
    const url = selectedCategory 
      ? `http://localhost:8000/items-with-highest-bids?categoryID=${selectedCategory}`
      : 'http://localhost:8000/items-with-highest-bids';

    axios.get(url)
      .then(response => {
        setItems(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching items:', error);
      });
  }, [selectedCategory]);

  // Handle category change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <div>
      <h2>Items for Bidding</h2>

      {/* Category filter dropdown */}
      <div>
        <label htmlFor="category">Filter by Category:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.CategoryID} value={category.CategoryID}>
              {category.CategoryName}
            </option>
          ))}
        </select>
      </div>

      {/* Display items */}
      <ul>
        {items.map(item => (
          <li key={item.ItemID} className="item-card">
            <Link to={`/item/${item.ItemID}`} className="item-link">
              {/* Conditionally render image if available */}
              {item.image_url && (
                <div>
                  <img
                    src={item.image_url}
                    alt={item.Title}
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

