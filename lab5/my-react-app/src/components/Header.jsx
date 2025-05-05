import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../firebase/auth";
import allGames from "../data/gamesList";

import '../styles/header.css';

function Header({ user }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  const searchGames = (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    const filteredGames = allGames.filter(game => game.title.toLowerCase().includes(term.toLowerCase()));
    setSearchResults(filteredGames);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchGames(value);
    setShowResults(true);
  };

  const handleGameClick = (url) => {
    window.open(url, "_blank");
    setShowResults(false);
    setSearchTerm("");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Помилка входу: ", error);
    }
  };
  
  return (
    <header className="header">
      <div className="left-section">
        <img className="side-menu" src='/assets/icons/side-menu.svg' alt="Side menu icon" />
        <img className="k-games-logo" src='/assets/icons/kgames-icon.svg' alt="KGames logo" />
      </div>

      <div className="middle-section">
        <div className="search-bar-container" ref={searchRef}>
          <input 
            className="search-bar" 
            type="text" 
            placeholder="Search" 
            value={searchTerm}
            onChange={handleSearchChange}
          />
                    
          {showResults && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((game, index) => (
                <div 
                  key={index} 
                  className="search-result-item"
                  onClick={() => handleGameClick(game.url)}
                >
                  <img 
                    src={game.image} 
                    alt={game.title} 
                    className="search-result-image" 
                  />
                  <div className="search-result-info">
                    <div className="search-result-title">{game.title}</div>
                    <div className="search-result-genre">{game.genre} • {game.stars}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {showResults && searchTerm && searchResults.length === 0 && (
            <div className="search-results">
              <div className="no-results">Ігри не знайдено</div>
            </div>
          )}
        </div>
      </div>

      <div className="right-section">
        <div className="liked-games-container">
          <Link to="/favourite" className="liked-games-button">
            <img className="liked-games" src='/assets/icons/heart-duotone.svg' alt="Favourite icon" />
          </Link>
          <span className="tooltip">Улюблені ігри</span>
        </div>
      </div>

      <div className="auth-container-header">
        {user ? (
          <div className="user-menu">
            <div className="user-profile-button">
              <img 
                className="user-avatar" 
                src='/assets/icons/user-logo.svg' 
                alt="User profile" 
              />
              <span className="user-email">{user.email}</span>
            </div>
            <div className="dropdown-menu">
              <Link to="/profile" className="dropdown-item">Профіль</Link>
              <button onClick={handleLogout} className="dropdown-item logout-button">
                Вийти
              </button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="login-button">
            Увійти
          </Link>
        )}
      </div>
    </header>
  );
}
export default Header;
