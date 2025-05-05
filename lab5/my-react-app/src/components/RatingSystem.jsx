import React, { useState, useEffect } from 'react';
import { isAuthenticated, getCurrentUser } from '../firebase/auth';
import { saveGameRating, getGameRating } from '../firebase/database';
import { showNotification } from '../components/Notification';

const RatingComponent = ({ gameId, gameTitle }) => {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  useEffect(() => {
    const loadUserRating = async () => {
      if (isLoggedIn) {
        const userId = getCurrentUser().uid;
        try {
          const rating = await getGameRating(userId, gameId);
          if (rating) {
            setUserRating(rating.value);
          }
        } catch (error) {
          console.error("Error loading rating:", error);
        }
      }
    };

    setIsLoggedIn(isAuthenticated());
    if (isLoggedIn) {
      loadUserRating();
    }
  }, [gameId, isLoggedIn]);

  const handleRatingClick = async (rating) => {
    if (!isLoggedIn) {
      showNotification("Увійдіть, щоб оцінити ігри", 3000);
      return;
    }

    setUserRating(rating);
    const userId = getCurrentUser().uid;
    try {
      await saveGameRating(userId, gameId, {
        gameId,
        gameTitle,
        value: rating,
        timestamp: new Date().toISOString()
      });
      showNotification(`Ви оцінили гру ${gameTitle} на ${rating} ${rating === 1 ? 'зірку' : 'зірки'}`, 3000);
    } catch (error) {
      console.error("Error saving rating:", error);
      showNotification("Помилка збереження рейтингу", 3000);
    }
  };

  const renderStars = () => {
    const stars = [];
    const maxRating = 5;
  
    for (let i = 1; i <= maxRating; i++) {
      const isFilled = i <= (hoverRating || userRating);
      stars.push(
        <span
          key={i}
          className="star-rating"
          style={{ color: '#ffd700' }} 
          onClick={() => handleRatingClick(i)}
          onMouseEnter={() => isLoggedIn && setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
        >
          {isFilled ? '★' : '☆'}
        </span>
      );
    }
  
    return stars;
  };
  

  return (
    <div className="rating-component">
      <div className="stars-container">
        {renderStars()}
        <span className="rating-number">{userRating > 0 ? userRating.toFixed(1) : '0.0'}</span>
      </div>
    </div>
  );
};

export default RatingComponent;