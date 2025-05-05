import React, { useState } from 'react';
import RatingComponent from '../components/RatingSystem';
import { isAuthenticated } from '../firebase/auth';
import { showNotification } from '../components/Notification';

const GameCard = ({ game, handleFavouriteToggle, isFavourite }) => {
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState(null);
  const imagePath = game.image;
  const heartIcon = isFavourite ? "/assets/icons/heart-logo.svg" : "/assets/icons/heart-duotone.svg";

  const handleHeartClick = () => {
    if (!isAuthenticated()) {
      showNotification("Увійдіть щоб додавати ігри в улюблені", 3000);
      return;
    }
    
    setClickCount(prevCount => prevCount + 1);
    
    if (clickTimer) {
      clearTimeout(clickTimer);
    }
    
    const timer = setTimeout(() => {
      setClickCount(0); 
    }, 300); 
    
    setClickTimer(timer);

    if (clickCount === 1) {
      handleFavouriteToggle(game);
      setClickCount(0);
      clearTimeout(timer);
      setClickTimer(null);
    }
  };

  const handleRatingInteraction = () => {
    if (!isAuthenticated()) {
      showNotification("Увійдіть, щоб оцінити ігри", 3000);
    }
  };

  return (
    <div 
      className={`game-preview ${isFavourite ? 'favourite' : ''}`} 
      data-title={game.title}
    >
      <div className="thumbnail-row">
        <img 
          className="game-image" 
          src={imagePath} 
          alt={game.title} 
        />
        <button 
          className="favourite-button"
          onClick={handleHeartClick} 
        >
          <img src={heartIcon} alt="Favourite indicator" />
        </button>
      </div>
      <div className="game-info">
        <h3 className="game-title">
          <a href={game.url} target="_blank" rel="noopener noreferrer">
            {game.title}
          </a>
        </h3>
        <p className="game-genre">Жанр: {game.genre}</p>
        <div className="game-rating">
          {isAuthenticated() ? (
            <RatingComponent gameId={game.id || game.title} gameTitle={game.title} />
          ) : (
            <div className="disabled-rating" onClick={handleRatingInteraction}>
              <span className="stars">☆☆☆☆☆</span>
              <span className="rating-number">0.0</span>
            </div>
          )}
        </div>
        <p className="active-players">
          <img src="/assets/icons/active-player-icon.svg" alt="Players" />
          <span>{game.activePlayers} активні гравці</span>
        </p>
      </div>
    </div>
  );
};

export default GameCard;