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

  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [visitorName, setVisitorName] = useState('');

  const token = localStorage.getItem('token');

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

  useEffect(() => {
    // Fetch comments
    axios
      .get(`http://localhost:8000/comments/${itemId}`)
      .then((res) => setComments(res.data))
      .catch((err) => console.error(err));
  }, [itemId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    const commentData = { itemId, content: commentContent };
    if (!token) {
      // Visitor must provide a name
      commentData.visitorName = visitorName;
    }
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    await axios.post('http://localhost:8000/comments', commentData, { headers });
    // Refresh comments
    const updated = await axios.get(`http://localhost:8000/comments/${itemId}`);
    setComments(updated.data);
    setCommentContent('');
    setVisitorName('');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="item-details-and-comments-container">
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
                {bid.BidderName} placed a bid of ${bid.BidAmount} on{' '}
                {new Date(bid.BidDate).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>

        {/* PlaceB component for placing a bid */}
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
                <strong>
                  {c.UserID ? 'User' : c.VisitorName || 'Visitor'}:
                </strong>{' '}
                {c.Content}
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
