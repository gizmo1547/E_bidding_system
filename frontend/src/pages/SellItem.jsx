import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SellItem.css'; // Import the CSS file

const SellItem = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [listingType, setListingType] = useState('ForSale');
  const [deadline, setDeadline] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories to populate the category dropdown
    axios.get('http://localhost:8000/categories')
      .then(response => {
        setCategories(response.data);
        if (response.data.length > 0) {
          setSelectedCategory(response.data[0].CategoryName); // default to first category
        }
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      // If no token, redirect to login
      navigate('/login');
      return;
    }

    const itemData = {
      title,
      description,
      askingPrice: parseFloat(askingPrice),
      listingType,
      deadline,
      image_url: imageUrl,
      categoryName: selectedCategory
    };

    try {
      const res = await axios.post('http://localhost:8000/items', itemData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data && res.data.message === 'Item created successfully') {
        navigate('/user-home');
      } else {
        setMessage(/*'Item creation failed. Check input and try again.'*/);
      }
    } catch (error) {
      console.error('Error creating item:', error);
      setMessage('Error creating item. Please try again.');
    }
  };

  return (
    <div className="sell-item-container">
      <h2>Sell an Item</h2>
      {message && <p className="error-message">{message}</p>}
      <form onSubmit={handleSubmit} className="sell-item-form">
        
        <label>
          Title:
          <input
            type="text"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label>
          Description:
          <textarea
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </label>

        <label>
          Asking Price:
          <input
            type="number"
            step="0.01"
            value={askingPrice}
            required
            onChange={(e) => setAskingPrice(e.target.value)}
          />
        </label>

        <label>
          Listing Type:
          <select value={listingType} onChange={(e) => setListingType(e.target.value)}>
            <option value="ForSale">For Sale</option>
            <option value="ForRent">For Rent</option>
          </select>
        </label>

        <label>
          Deadline:
          <input
            type="datetime-local"
            value={deadline}
            required
            onChange={(e) => setDeadline(e.target.value)}
          />
        </label>

        <label>
          Category:
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {categories.map((cat) => (
              <option key={cat.CategoryID} value={cat.CategoryName}>
                {cat.CategoryName}
              </option>
            ))}
          </select>
        </label>

        <label>
          Image URL:
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </label>

        <button type="submit">List Item</button>
      </form>
    </div>
  );
};

export default SellItem;


/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SellItem = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [listingType, setListingType] = useState('ForSale');
  const [deadline, setDeadline] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/categories')
      .then(response => {
        setCategories(response.data);
        if (response.data.length > 0) {
          setSelectedCategory(response.data[0].CategoryName); 
        }
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const itemData = {
      title,
      description,
      askingPrice: parseFloat(askingPrice),
      listingType,
      deadline,
      image_url: imageUrl,
      categoryName: selectedCategory
    };

    try {
      const res = await axios.post('http://localhost:8000/items', itemData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data && res.data.message === 'Item created successfully') {
        navigate('/user-home');
      } else {
        setMessage('Item creation failed. Check input and try again.');
      }
    } catch (error) {
      console.error('Error creating item:', error);
      setMessage('Error creating item. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px' }}>
      <h2>Sell an Item</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <label>
          Title:
          <input
            type="text"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label>
          Description:
          <textarea
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </label>

        <label>
          Asking Price:
          <input
            type="number"
            step="0.01"
            value={askingPrice}
            required
            onChange={(e) => setAskingPrice(e.target.value)}
          />
        </label>

        <label>
          Listing Type:
          <select value={listingType} onChange={(e) => setListingType(e.target.value)}>
            <option value="ForSale">ForSale</option>
            <option value="ForRent">ForRent</option>
            <option value="Wanted">Wanted</option>
          </select>
        </label>

        <label>
          Deadline:
          <input
            type="datetime-local"
            value={deadline}
            required
            onChange={(e) => setDeadline(e.target.value)}
          />
        </label>

        <label>
          Category:
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {categories.map((cat) => (
              <option key={cat.CategoryID} value={cat.CategoryName}>
                {cat.CategoryName}
              </option>
            ))}
          </select>
        </label>

        <label>
          Image URL:
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </label>

        <button type="submit" style={{ padding: '10px 15px', cursor: 'pointer' }}>
          List Item
        </button>
      </form>
    </div>
  );
};

export default SellItem;

*/