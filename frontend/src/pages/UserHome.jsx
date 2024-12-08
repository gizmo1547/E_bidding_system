/*import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserHome.css'; // Import the CSS file for styling

const UserHome = () => {
  const [userData, setUserData] = useState({});
  const [categories, setCategories] = useState([]); // Replace static categories with dynamic state
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [message, setMessage] = useState(''); // For error handling
  const navigate = useNavigate();

  // Function to fetch categories from the backend
  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8000/categories'); // Backend endpoint for categories
      const categoryNames = res.data.map((category) => category.CategoryName); // Extract category names
      setCategories(categoryNames); // Update the state
    } catch (error) {
      console.error('Error fetching categories:', error);
      setMessage('Failed to load categories. Please try again.');
    }
  }, []);

  // Function to fetch user data from the backend
  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // If no token, redirect to login
        navigate('/login');
        return;
      }

      const res = await axios.get('http://localhost:8000/user-data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(res.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessage('Failed to load user data. Please try again.');
      if (error.response && error.response.status === 401) {
        navigate('/login'); // Redirect to login if unauthorized
      }
    }
  }, [navigate]);

  // Function to fetch items from the backend
  const fetchItems = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8000/items', {
        params: selectedCategory ? { category: selectedCategory } : {},
      });
      setItems(res.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      setMessage('Failed to load items. Please try again.');
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchCategories(); // Fetch categories from the backend
    fetchUserData(); // Fetch user data from the backend
    fetchItems(); // Fetch items based on selected category
  }, [fetchCategories, fetchUserData, fetchItems]);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // Function to navigate to add money page
  const handleAddMoney = () => {
    navigate('/add-money');
  };

  // Function to navigate to account manager page
  const handleAccountManager = () => {
    navigate('/account-manager');
  };

  // Function to handle category selection
  const handleCategoryClick = (category) => {
    setSelectedCategory(category === 'More' ? null : category);
  };

  return (
    <div className="user-home-container">
      <header>
        <h1>E-Bidding Store</h1>
        <div className="user-info">
          <span>Welcome, {userData.Username}!</span>
          <span>Balance: ${userData.AccountBalance?.toFixed(2) || '0.00'}</span>
          <button onClick={handleAddMoney}>Add Money</button>
          <button onClick={handleAccountManager}>Account Manager</button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {message && <p className="error">{message}</p>}

      <div className="main-content">
        <aside className="sidebar">
          <h3>Categories</h3>
          <ul>
            {categories.map((category, index) => (
              <li
                key={index}
                className={selectedCategory === category ? 'active' : ''}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </aside>

        <section className="items-section">
          <h3>{selectedCategory || 'All'} Items</h3>
          <div className="items-container">
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item.ItemID} className="item-card">
                  <img src="/images/airpods.jpg" alt={item.Title} />
                  <h4>{item.Title}</h4>
                  <p>{item.Description}</p>
                  <p>Price: ${item.AskingPrice}</p>
                  <p>Deadline: {new Date(item.Deadline).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p>No items found.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserHome;
*/
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserHome.css'; // Import the CSS file for styling
import ItemList from './ItemList'; // Import the ItemList component

const UserHome = () => {
  const [userData, setUserData] = useState({});
  const [categories, setCategories] = useState([]); // Replace static categories with dynamic state
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [message, setMessage] = useState(''); // For error handling
  const navigate = useNavigate();

  // Function to fetch categories from the backend
  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8000/categories'); // Backend endpoint for categories
      const categoryNames = res.data.map((category) => category.CategoryName); // Extract category names
      setCategories(categoryNames); // Update the state
    } catch (error) {
      console.error('Error fetching categories:', error);
      setMessage('Failed to load categories. Please try again.');
    }
  }, []);

  // Function to fetch user data from the backend
  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // If no token, redirect to login
        navigate('/login');
        return;
      }

      const res = await axios.get('http://localhost:8000/user-data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(res.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessage('Failed to load user data. Please try again.');
      if (error.response && error.response.status === 401) {
        navigate('/login'); // Redirect to login if unauthorized
      }
    }
  }, [navigate]);

  // Function to fetch items from the backend
  const fetchItems = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8000/items', {
        params: selectedCategory ? { category: selectedCategory } : {},
      });
      setItems(res.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      setMessage('Failed to load items. Please try again.');
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchCategories(); // Fetch categories from the backend
    fetchUserData(); // Fetch user data from the backend
    fetchItems(); // Fetch items based on selected category
  }, [fetchCategories, fetchUserData, fetchItems]);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // Function to navigate to add money page
  const handleAddMoney = () => {
    navigate('/add-money');
  };

  // Function to navigate to account manager page
  const handleAccountManager = () => {
    navigate('/account-manager');
  };

  // Function to handle category selection
  const handleCategoryClick = (category) => {
    setSelectedCategory(category === 'More' ? null : category);
  };

  return (
    <div className="user-home-container">
      <header>
        <h1>E-Bidding Store</h1>
        <div className="user-info">
          <span>Welcome, {userData.Username}!</span>
          <span>Balance: ${userData.AccountBalance?.toFixed(2) || '0.00'}</span>
          <button onClick={handleAddMoney}>Add Money</button>
          <button onClick={handleAccountManager}>Account Manager</button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {message && <p className="error">{message}</p>}

      <div className="main-content">
        <aside className="sidebar">
          <h3>Categories</h3>
          <ul>
            {categories.map((category, index) => (
              <li
                key={index}
                className={selectedCategory === category ? 'active' : ''}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </aside>

        <section className="items-section">
          <h3>{selectedCategory || 'All'} Items</h3>
             {/* Embed ItemList as a section */}
             <ItemList /> {/* This will render your ItemList component */}
        </section>
      </div>
    </div>
  );
};

export default UserHome;












/*
// UserHome.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserHome.css'; // Import the CSS file for styling
import item from '../component/item';


const UserHome = () => {
  const [userData, setUserData] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // State for categories and items
  const [categories] = useState([
    'Art',
    'Electronics',
    'Furniture',
    'Software',
    'Games',
    'Motor vehicles',
    
  ]);

   
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

const UserHome = () => {
  const [categories, setCategories] = useState([]); // State for categories
  const [message, setMessage] = useState(''); // For error handling



  // Function to fetch user data from the backend
  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // If no token, redirect to login
        navigate('/login');
        return;
      }

      const res = await axios.get('http://localhost:8000/user-data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(res.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessage('Failed to load user data. Please try again.');
      // Optionally, redirect to login if unauthorized
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  }, [navigate]);

  // Function to fetch items from the backend
  const fetchItems = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8000/items', {
        params: selectedCategory ? { category: selectedCategory } : {},
      });
      setItems(res.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      setMessage('Failed to load items. Please try again.');
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchUserData();
    fetchItems();
  }, [fetchUserData, fetchItems]);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // Function to navigate to add money page
  const handleAddMoney = () => {
    navigate('/add-money');
  };

  // Function to navigate to account manager page
  const handleAccountManager = () => {
    navigate('/account-manager');
  };

  // Function to handle category selection
  const handleCategoryClick = (category) => {
    setSelectedCategory(category === 'More' ? null : category);
  };

  return (
    <div className="user-home-container">
      <header>
        <h1>E-Bidding Store</h1>
        <div className="user-info">
          <span>Welcome, {userData.Username}!</span>
          <span>Balance: ${userData.AccountBalance?.toFixed(2) || '0.00'}</span>
          <button onClick={handleAddMoney}>Add Money</button>
          <button onClick={handleAccountManager}>Account Manager</button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {message && <p className="error">{message}</p>}

      <div className="main-content">
        <aside className="sidebar">
          <h3>Categories</h3>
          <ul>
            {categories.map((category, index) => (
              <li
                key={index}
                className={selectedCategory === category ? 'active' : ''}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </aside>

        <section className="items-section">
          <h3>{selectedCategory || 'All'} Items</h3>
          <div className="items-container">
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item.ItemID} className="item-card">
                  <img src= '/images/airpods.jpg' alt={item.Title} />
                  <h4>{item.Title}</h4>
                  <p>{item.Description}</p>
                  <p>Price: ${item.AskingPrice}</p>
                  <p>Deadline: {new Date(item.Deadline).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p>No items found.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserHome;

*/
/*
// UserHome.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//import './UserHome.css'; // Import the CSS file for styling
import item from '../component/item';

const UserHome = () => {
  const [userData, setUserData] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // State for categories and items
  const [categories] = useState([
    'Art',
    'Electronics',
    'Furniture',
    'Software',
    'Games',
    'Motor vehicles',
    
  ]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Function to fetch user data from the backend
  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // If no token, redirect to login
        navigate('/login');
        return;
      }

      const res = await axios.get('http://localhost:8000/user-data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(res.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessage('Failed to load user data. Please try again.');
      // Optionally, redirect to login if unauthorized
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  }, [navigate]);

  // Function to fetch items from the backend
  const fetchItems = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8000/items', {
        params: selectedCategory ? { category: selectedCategory } : {},
      });
      setItems(res.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      setMessage('Failed to load items. Please try again.');
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchUserData();
    fetchItems();
  }, [fetchUserData, fetchItems]);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // Function to navigate to add money page
  const handleAddMoney = () => {
    navigate('/add-money');
  };

  // Function to navigate to account manager page
  const handleAccountManager = () => {
    navigate('/account-manager');
  };

  // Function to handle category selection
  const handleCategoryClick = (category) => {
    setSelectedCategory(category === 'More' ? null : category);
  };

  return (
    <div className="user-home-container">
      <header>
        <h1>E-Bidding Store</h1>
        <div className="user-info">
          <span>Welcome, {userData.Username}!</span>
          <span>Balance: ${userData.AccountBalance?.toFixed(2) || '0.00'}</span>
          <button onClick={handleAddMoney}>Add Money</button>
          <button onClick={handleAccountManager}>Account Manager</button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {message && <p className="error">{message}</p>}

      <div className="main-content">
        <aside className="sidebar">
          <h3>Categories</h3>
          <ul>
            {categories.map((category, index) => (
              <li
                key={index}
                className={selectedCategory === category ? 'active' : ''}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </aside>

        <section className="items-section">
          <h3>{selectedCategory || 'All'} Items</h3>
          <div className="items-container">
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item.ItemID} className="item-card">
                  <img src= '/images/airpods.jpg' alt={item.Title} />
                  <h4>{item.Title}</h4>
                  <p>{item.Description}</p>
                  <p>Price: ${item.AskingPrice}</p>
                  <p>Deadline: {new Date(item.Deadline).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p>No items found.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
export default UserHome;
*/
/*
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//import './UserHome.css';

const UserHome = () => {
  const [userData, setUserData] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Function to fetch user data from the backend
  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // If no token, redirect to login
        navigate('/login');
        return;
      }

      const res = await axios.get('http://localhost:8000/user-data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(res.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessage('Failed to load user data. Please try again.');
      // Optionally, redirect to login if unauthorized
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // Function to navigate to add money page
  const handleAddMoney = () => {
    navigate('/add-money');
  };

  // Function to navigate to account manager page
  const handleAccountManager = () => {
    navigate('/account-manager');
  };

  return (
    <div className="user-home-container">
      <h2>Welcome, {userData.Username}!</h2>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      {message && <p className="error">{message}</p>}
      <div className="account-info">
        <h3>Your Account Balance:</h3>
        <p>${userData.AccountBalance}</p>
      </div>
      <div className="user-actions">
        <button onClick={handleAddMoney}>Add Money</button>
        <button onClick={handleAccountManager}>Account Manager</button>
      </div>
    </div>
  );
};

export default UserHome;
*/
