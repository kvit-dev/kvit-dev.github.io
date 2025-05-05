import React, { useState, useEffect, useMemo, useCallback } from "react";
import "../styles/games-page.css";
import allGames from "../data/gamesList";
import GameCard from "../components/GameCard";
import { getAllGameRatings } from "../firebase/database";
import { isAuthenticated } from "../firebase/auth";

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
  const [gameRatings, setGameRatings] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  useEffect(() => {
    const loadGameRatings = async () => {
      try {
        const ratings = await getAllGameRatings();
        setGameRatings(ratings);
      } catch (error) {
        console.error("Error loading game ratings:", error);
      }
    };

    loadGameRatings();
  }, []);

  const generateStars = useCallback((rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 > 0;
    const emptyStars = 5 - Math.ceil(rating);
    return "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(emptyStars);
  }, []);

  const getGameRating = useCallback((gameId) => {
    const gameRating = gameRatings[gameId];
    return gameRating ? gameRating.averageRating : 0;
  }, [gameRatings]);

  const puzzleGames = useMemo(() =>
    allGames.filter(game => game.genre === "Puzzle").map(game => {
      const rating = getGameRating(game.id || game.title);
      return {
        ...game,
        id: game.id || game.title,
        rating,
        stars: generateStars(rating)
      };
    }), [generateStars, getGameRating]);

  const ioGames = useMemo(() =>
    allGames.filter(game => game.genre === ".io").map(game => {
      const rating = getGameRating(game.id || game.title);
      return {
        ...game,
        id: game.id || game.title,
        rating,
        stars: generateStars(rating)
      };
    }), [generateStars, getGameRating]);

  const casualGames = useMemo(() =>
    allGames.filter(game => game.genre === "Casual").map(game => {
      const rating = getGameRating(game.id || game.title);
      return {
        ...game,
        id: game.id || game.title,
        rating,
        stars: generateStars(rating)
      };
    }), [generateStars, getGameRating]);

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

      {isLoggedIn && (
        <div className="sorting-controls">
          <button
            className={`sort-button ${isSorted ? 'active' : ''}`}
            onClick={toggleSort}
          >
            {isSorted ? 'Скасувати сортування' : 'Сортувати за рейтингом'}
          </button>
        </div>
      )}

      <GameCategory
        title="Головоломки"
        games={puzzleGames}
        handleFavouriteToggle={handleFavouriteToggle}
        favourites={favourites}
        isSorted={isLoggedIn && isSorted}
      />

      <GameCategory
        title=".io Ігри"
        games={ioGames}
        handleFavouriteToggle={handleFavouriteToggle}
        favourites={favourites}
        isSorted={isLoggedIn && isSorted}
      />

      <GameCategory
        title="Звичайні Ігри"
        games={casualGames}
        handleFavouriteToggle={handleFavouriteToggle}
        favourites={favourites}
        isSorted={isLoggedIn && isSorted}
      />

      <Recommendations
        title="Рекомендовано для вас"
        games={recommendations}
        onRefresh={refreshRecommendations}
        handleFavouriteToggle={handleFavouriteToggle}
        favourites={favourites}
        isSorted={isLoggedIn && isSorted}
      />
    </main>
  );
};

export default GamesPage;
