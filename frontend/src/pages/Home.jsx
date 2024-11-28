import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Item from '../components/Item';
import './Home.css';

const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [items, setItems] = useState([ // All items to be divided into sections
        { title: 'Item 1', imgSrc: '/images/itemIcon.png', description: 'Description of item 1' },
        { title: 'Item 2', imgSrc: '/images/itemIcon.png', description: 'Description of item 2' },
        { title: 'Item 3', imgSrc: '/images/itemIcon.png', description: 'Description of item 3' },
        { title: 'Item 4', imgSrc: '/images/itemIcon.png', description: 'Description of item 4' },
        { title: 'Item 5', imgSrc: '/images/itemIcon.png', description: 'Description of item 5' },
        // More items could go here...
    ]);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the token exists in localStorage
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleLogout = () => {
        // Clear the token and update the login state
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login'); // Redirect to the login page
    };

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <h1>Welcome! You are logged in.</h1>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div>
                    <div className='login-bar'>
                        <h1>Shopbid! </h1>
                        <div className='button-container'>
                            <button onClick={() => navigate('/login')}> Login</button>
                            <button onClick={() => navigate('/registration')}>Registrate</button>
                        </div>
                    </div>
                    <div className='menu-bar'>
                        <div className='categories'>
                            <h2>Categories</h2>
                            <ul>
                              <li onClick={() => navigate('/login')}>Electronics</li>
                              <li onClick={() => navigate('/login')}>Home & Garden</li>
                              <li onClick={() => navigate('/login')}>Automotive</li>
                              <li onClick={() => navigate('/login')}>Books</li>
                              <li onClick={() => navigate('/login')}>Clothing</li>
                              <li onClick={() => navigate('/login')}>Health & Beauty</li>
                            </ul>
                        </div>
                        <div className='options'>
                            <h2>Options</h2>
                            <ul onClick={navigate()}>
                              <li onClick={() => navigate('/login')}>My Items</li>
                              <li onClick={() => navigate('/login')}>My Bids</li>
                              <li onClick={() => navigate('/login')}>My Account</li>
                              <li onClick={() => navigate('/login')}>Help</li>
                            </ul>
                        </div>
                    </div>

                    <div className='description'>
                        <p>"Welcome to Shopbid, the premier online auction platform. Whether you're new or returning, explore a variety of electronics, home goods, and more. Start bidding today!"</p>
                    </div>

                    {/* Most Sold Section */}
                    <div className='items'>
                        <h2>Most Sold</h2>
                        <div className='card-deck'>
                            {items.slice(0, 3).map((item, index) => ( // Display top 3 items for Most Sold
                                <Item 
                                    key={index}
                                    title={item.title}
                                    imgSrc={item.imgSrc}
                                    description={item.description}
                                />
                            ))}
                        </div>
                        <button onClick={() => navigate('/most-sold')}>See More</button>
                    </div>

                    {/* Christmas Gifts Ideas Section */}
                    <div className='items'>
                        <h2>Christmas Gift Ideas</h2>
                        <div className='card-deck'>
                            {items.slice(3, 6).map((item, index) => ( // Display next set of items for Christmas Gifts
                                <Item 
                                    key={index}
                                    title={item.title}
                                    imgSrc={item.imgSrc}
                                    description={item.description}
                                />
                            ))}
                        </div>
                        <button onClick={() => navigate('/christmas-gifts')}>See More</button>
                    </div>

                    {/* Top in Categories Section */}
                    <div className='items'>
                        <h2>Top in Categories</h2>
                        <div className='card-deck'>
                            {items.slice(0, 5).map((item, index) => ( // Display a mix of items for top categories
                                <Item 
                                    key={index}
                                    title={item.title}
                                    imgSrc={item.imgSrc}
                                    description={item.description}
                                />
                            ))}
                        </div>
                        <button onClick={() => navigate('/top-categories')}>See More</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;