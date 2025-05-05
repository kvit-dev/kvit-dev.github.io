import React, { useState, useEffect, useMemo, useCallback } from "react";
import "../styles/games-page.css";
import allGames from "../data/gamesList"; 

const GameCategory = ({ title, games, handleFavouriteToggle, favourites, isSorted }) => {
  const displayedGames = isSorted 
    ? [...games].sort((a, b) => b.rating - a.rating) 
    : games;

  return (
    <div className="game-categories">
      <h2 className="category-title">{title}</h2>
      <div className="games-grid">
        {displayedGames.map((game, index) => (
          <GameCard 
            key={index} 
            game={game} 
            handleFavouriteToggle={handleFavouriteToggle}
            isFavourite={favourites.some(fav => fav.title === game.title)}
          />
        ))}
      </div>
    </div>
  );
};

const GameCard = ({ game, handleFavouriteToggle, isFavourite }) => {
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState(null);
  const imagePath = game.image;
  const heartIcon = isFavourite ? "/assets/icons/heart-logo.svg" : "/assets/icons/heart-duotone.svg";

  const handleHeartClick = () => {
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
          <span className="stars">{game.stars}</span>
          <span className="rating-number">{game.rating}</span>
        </div>
        <p className="active-players">
          <img src="/assets/icons/active-player-icon.svg" alt="Players" />
          <span>{game.activePlayers} активні гравці</span>
        </p>
      </div>
    </div>
  );
};

const Recommendations = ({ title, games, onRefresh, handleFavouriteToggle, favourites, isSorted }) => {
  const displayedGames = isSorted 
    ? [...games].sort((a, b) => b.rating - a.rating) 
    : games;

  return (
    <div className="recommendations-section">
      <h2 className="recs-category-title">{title}</h2>
      <div className="games-grid" id="recommendations-grid">
        {displayedGames.map((game, index) => (
          <GameCard 
            key={index} 
            game={game} 
            handleFavouriteToggle={handleFavouriteToggle}
            isFavourite={favourites.some(fav => fav.title === game.title)}
          />
        ))}
      </div>
      <div className="refresh-button-container">
        <button className="refresh-button" onClick={onRefresh}>
          Оновити
        </button>
      </div>
    </div>
  );
};

const GamesPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [isSorted, setIsSorted] = useState(false); 

  const generateStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 > 0;
    const emptyStars = 5 - Math.ceil(rating);
    
    return "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(emptyStars);
  };

  const puzzleGames = useMemo(() =>
    allGames.filter(game => game.genre === "Puzzle").map(game => ({
      ...game,
      stars: generateStars(game.rating)
    })), []);

  const ioGames = useMemo(() =>
    allGames.filter(game => game.genre === ".io").map(game => ({
      ...game,
      stars: generateStars(game.rating)
    })), []);

  const casualGames = useMemo(() =>
    allGames.filter(game => game.genre === "Casual").map(game => ({
      ...game,
      stars: generateStars(game.rating)
    })), []);

  const allGamesList = useMemo(() => [...puzzleGames, ...ioGames, ...casualGames], [
    puzzleGames,
    ioGames,
    casualGames
  ]);

  useEffect(() => {
    const storedTitles = JSON.parse(localStorage.getItem('favouriteGames')) || [];
    const matchedGames = allGamesList.filter(game => storedTitles.includes(game.title));
    setFavourites(matchedGames);
  }, [allGamesList]);

  const refreshRecommendations = useCallback(() => {
    const shuffled = [...allGamesList].sort(() => 0.5 - Math.random());
    setRecommendations(shuffled.slice(0, 4));
  }, [allGamesList]);

  const handleFavouriteToggle = (game) => {
    setFavourites(prev => {
      const isAlreadyFavourite = prev.some(fav => fav.title === game.title);
      
      let newFavourites;
      if (isAlreadyFavourite) {
        newFavourites = prev.filter(fav => fav.title !== game.title);
      } else {
        newFavourites = [...prev, game];
      }
      
      const titles = newFavourites.map(g => g.title);
      localStorage.setItem('favouriteGames', JSON.stringify(titles));
      
      return newFavourites;
    });
  };

  const toggleSort = () => {
    setIsSorted(prevState => !prevState);
  };

  useEffect(() => {
    refreshRecommendations();
  }, [refreshRecommendations]);

  return (
    <main className="games-section">
      <h1>Колекція ігор</h1>
      
      <div className="sorting-controls">
        <button 
          className={`sort-button ${isSorted ? 'active' : ''}`} 
          onClick={toggleSort}
        >
          {isSorted ? 'Скасувати сортування' : 'Сортувати за рейтингом'}
        </button>
      </div>
      
      <GameCategory 
        title="Головоломки" 
        games={puzzleGames} 
        handleFavouriteToggle={handleFavouriteToggle}
        favourites={favourites}
        isSorted={isSorted}
      />
      
      <GameCategory 
        title=".io Ігри" 
        games={ioGames} 
        handleFavouriteToggle={handleFavouriteToggle}
        favourites={favourites}
        isSorted={isSorted}
      />
      
      <GameCategory 
        title="Звичайні Ігри" 
        games={casualGames} 
        handleFavouriteToggle={handleFavouriteToggle}
        favourites={favourites}
        isSorted={isSorted}
      />

      <Recommendations
        title="Рекомендовано для вас"
        games={recommendations}
        onRefresh={refreshRecommendations}
        handleFavouriteToggle={handleFavouriteToggle}
        favourites={favourites}
        isSorted={isSorted}
      />
    </main>
  );
};

export default GamesPage;