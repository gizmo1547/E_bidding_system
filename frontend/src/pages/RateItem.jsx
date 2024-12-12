import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const RateItem = () => {
  const { itemId } = useParams();
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  const submitRating = async () => {
    try {
      await axios.post(`http://localhost:8000/rate-item/${itemId}`, { rating }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Rating submitted successfully.');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error submitting rating:', err);
    }
  };

  return (
    <div>
      <h1>Rate Your Purchase</h1>
      <p>How would you rate the item you purchased?</p>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => setRating(star)}
          style={{ color: star <= rating ? 'gold' : 'gray' }}
        >
          ★
        </button>
      ))}
      <button onClick={submitRating}>Submit Rating</button>
    </div>
  );
};

export default RateItem;


/*
import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const RateItem = () => {
  const { itemId } = useParams();
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  const submitRating = () => {
    axios.post(`http://localhost:8000/rate-item/${itemId}`, { rating })
      .then(response => {
        console.log('Rating submitted:', response.data);
        // Redirect back to user dashboard or anywhere else after success
        navigate('/dashboard');
      })
      .catch(err => console.error('Error submitting rating:', err));
  };

  return (
    <div>
      <h1>Rate Your Purchase</h1>
      <p>Please rate the item you just bought:</p>
      <div>
        {/* Simple star rating input *///}
        //{[1, 2, 3, 4, 5].map(star => (
          //<button 
            //key={star} 
            //={() => setRating(star)}
            //style={{ color: star <= rating ? 'gold' : 'gray' }}
          //>
           // ★
          //</button>
        //))}
      //</div>
      //<button onClick={submitRating}>Submit Rating</button>
    //</div>
  //);
//};

//export default RateItem;

//*/