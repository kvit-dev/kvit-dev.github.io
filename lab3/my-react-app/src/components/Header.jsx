import React from "react";
import { Link } from "react-router-dom";

import '../styles/header.css';

function Header() {
  return (
    <header className="header">
      <div className="left-section">
        <img className="side-menu" src='/assets/icons/side-menu.svg' alt="Side menu icon" />
        <img className="k-games-logo" src='/assets/icons/kgames-icon.svg' alt="KGames logo" />
      </div>

      <div className="middle-section">
        <input className="search-bar" type="text" placeholder="Search" />
        <button className="search-button">
          <img className="search-icon" src='/assets/icons/search.svg' alt="Search icon" />
          <span className="tooltip">Пошук</span>
        </button>
      </div>

      <div className="right-section">
        <div className="liked-games-container">
          <Link to="/favourite" className="liked-games-button">
            <img className="liked-games" src='/assets/icons/heart-duotone.svg' alt="Favourite icon" />
          </Link>
          <span className="tooltip">Улюблені ігри</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
