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
  const [comments, setComments] = useState([]); // Ensure it's initialized as an empty array
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchItemDetails = async () => {
      setLoading(true); // Start loading state
      try {
        // Fetch item details and bids
        const itemResponse = await axios.get(`http://localhost:8000/item/${itemId}`);
        setItem(itemResponse.data.item);
        setBids(itemResponse.data.bids);
  
        // Fetch comments for this item
        const commentsResponse = await axios.get(`http://localhost:8000/comments/${itemId}`);
        const comments = commentsResponse.data.comments; // Extract the comments array
        setComments(Array.isArray(comments) ? comments : []);
  
      } catch (err) {
        console.error('Error fetching item details or comments:', err);
        setError('Error fetching item details or comments');
      } finally {
        setLoading(false); // End loading state in both success and error cases
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

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      return; // Prevent submitting empty comments
    }
  
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://localhost:8000/post-comments',
        { ItemId: itemId, Content: newComment },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}, // Include header only if token exists
        }
      );
  
      setComments([
        ...comments,
        {
          CommentID: response.data.commentId,
          Username: token ? 'You' : 'Anonymous',
          Content: newComment,
          CreatedAt: new Date(),
        },
      ]);
      setNewComment(''); // Clear input field after submitting
    } catch (err) {
      console.error('Failed to post comment', err);
      setError('Failed to post comment. Please try again later.');
    }
  };

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

      {/* PlaceB component for placing a bid */}
      <div className="placebid-section-container">
        <PlaceB itemId={itemId} />
      </div>
    </div>
      <div className='comment-section'>
          <h3>Comments</h3>
          {error && <p className="error-message">{error}</p>}
          <ul className="comments-list">
            {comments.map((comment) => (
              <li key={comment.CommentID} className="comment-item">
                <strong>{comment.Username}</strong>: {comment.Content}
              </li>
            ))}
          </ul>
          <div className="comment-input-container">
            <textarea
              className="comment-input"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
            <button className="comment-submit-button" onClick={handleComment}>Post Comment</button>
          </div>
        </div>
  </div>
  );
};

export default ItemDetails;