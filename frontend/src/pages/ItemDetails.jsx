import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PlaceB from './PlaceB'; 
import './ItemDetails.css';

const ItemDetails = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [visitorName, setVisitorName] = useState('');

  const [timeLeft, setTimeLeft] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch item and bids
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
    // Fetch comments
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/comments/${itemId}`);
        setComments(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComments();
  }, [itemId]);

  useEffect(() => {
    if (!item || !item.Deadline) return;

    const updateTimer = () => {
      const now = new Date();
      const deadline = new Date(item.Deadline);
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeLeft('Bidding ended');
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        setTimeLeft(`${days}d ${hours}h ${minutes}m remaining`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);

    return () => clearInterval(interval);
  }, [item]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    const commentData = { itemId, content: commentContent };
    if (!token) commentData.visitorName = visitorName;

    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    try {
      await axios.post('http://localhost:8000/comments', commentData, { headers });
      const updatedComments = await axios.get(`http://localhost:8000/comments/${itemId}`);
      setComments(updatedComments.data);
      setCommentContent('');
      setVisitorName('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="item-details-and-comments-container">
      <div className="main-content">
        <div className="item-details">
          <h1>Item Details</h1>
          {item && (
            <>
              <div>
                <img src={item.image_url} alt={item.Name} className="item-image" />
              </div>
              <h2>{item.Name}</h2>
              <p>{item.Description}</p>
              <p>Starting Price: ${item.AskingPrice}</p>
              <p>Status: {item.Status}</p>
              <p>Time Left: {timeLeft}</p>
            </>
          )}
          <h3>Bids</h3>
          <ul>
            {bids.map((bid) => (
              <li key={bid.BidID}>
                {bid.BidderName} placed a bid of ${bid.BidAmount} on {new Date(bid.BidDate).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>

        {/* PlaceB Component */}
        <div className="placebid-section-container">
          <PlaceB itemId={itemId} />
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h3>Comments</h3>
        <div className="comments-list">
          {comments.map((c) => (
            <div key={c.CommentID} className="comment-card">
              <p>
              <strong>{c.Username}:</strong> {c.Content}
              </p>
              <small>{new Date(c.CommentDate).toLocaleString()}</small>
            </div>
          ))}
        </div>
        <form onSubmit={handleAddComment} className="comment-form">
          {!token && (
            <div className="form-group">
              <label htmlFor="visitorName">Your Name:</label>
              <input
                id="visitorName"
                type="text"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                required
                placeholder="Enter your name"
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="commentContent">Your Comment:</label>
            <textarea
              id="commentContent"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              required
              placeholder="Write your comment here..."
            ></textarea>
          </div>
          <button type="submit" className="submit-comment-button">
            Submit Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default ItemDetails;

