import React from 'react';

const GameCard = ({ game, handleFavouriteToggle, isFavourite }) => {
  const heartIcon = isFavourite ? "icons/heart-logo.svg" : "icons/heart-duotone.svg";

  return (
    <div className={`game-preview ${isFavourite ? 'favourite' : ''}`} data-title={game.title}>
      <div className="thumbnail-row">
        <img className="game-image" src={game.image} alt={game.title} />
        <button className="favourite-button" onClick={() => handleFavouriteToggle(game)}>
          <img src={heartIcon} alt="Add to favourites" />
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
          <span className="stars">{game.stars}</span>
          <span className="rating-number">{game.rating}</span>
        </div>
        <p className="active-players">
          <img src="icons/active-player-icon.svg" alt="Players" />
          <span>{game.activePlayers} активні гравці</span>
        </p>
      </div>
    </div>
  );
};

export default GameCard;
