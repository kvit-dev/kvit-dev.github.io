import React, { useEffect, useState } from "react";

import "../styles/favourite.css";

import allGames from "../data/gamesList";

const FavouritesPage = () => {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const titles = JSON.parse(localStorage.getItem("favouriteGames")) || [];
    const matched = allGames.filter((game) => titles.includes(game.title));
    setFavourites(matched);
  }, []);

  const generateStars = (rating) => {
    const full = Math.floor(rating);
    const hasHalf = rating % 1 > 0;
    const empty = 5 - Math.ceil(rating);
    return "★".repeat(full) + (hasHalf ? "☆" : "") + "☆".repeat(empty);
  };

  const removeFromFavourites = (title) => {
    const updated = favourites.filter((game) => game.title !== title);
    setFavourites(updated);
    localStorage.setItem(
      "favouriteGames",
      JSON.stringify(updated.map((g) => g.title))
    );
  };

  return (
    <div className="favourites-page">
      <div className="main-content">
        <h1 className="favourite-title">Улюблені ігри</h1>
        {favourites.length === 0 ? (
          <div className="no-favourites">У вас ще немає улюблених ігор. ДВІЧІ клацніть іконку серця на іграх, які вам подобаються</div>
        ) : (
          <div className="favourites-list">
            {favourites.map((game) => (
              <div key={game.title} className="favourite-item">
                <img
                  className="favourite-item-image"
                  src={game.image}
                  alt={game.title}
                />
                <div className="favourite-item-info">
                  <h2 className="favourite-item-title">{game.title}</h2>
                  <p className="favourite-item-genre">Жанр: {game.genre}</p>
                  <div className="favourite-item-rating">
                    <span className="stars">{generateStars(game.rating)}</span>
                    <span className="rating-number">{game.rating}</span>
                  </div>
                  <div className="favourite-item-players">
                    <img src="/assets/icons/active-player-icon.svg" alt="players" />
                    <span>{game.activePlayers} активні гравці</span>
                  </div>
                </div>
                <button
                  className="remove-favourite-button"
                  onClick={() => removeFromFavourites(game.title)}
                >
                  <img src="/assets/icons/heart-logo.svg" alt="Remove favourite" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavouritesPage;