import React from "react";
import { Link } from "react-router-dom";

import '../styles/sidebar.css';

function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-link">
        <Link to="/" className="sidebar-link-anchor">
          <img src='/assets/icons/home-page-icon.svg' alt="Home icon" />
          <div>Головна</div>
        </Link>
      </div>

      <div className="sidebar-link">
        <Link to="/games" className="sidebar-link-anchor">
          <img src='/assets/icons/games-icon.svg' alt="Games icon" />
          <div>Ігри</div>
        </Link>
      </div>

      <div className="sidebar-link">
        <Link to="/tournaments" className="sidebar-link-anchor">
          <img src='/assets/icons/trophy-icon.svg' alt="Trophy icon" />
          <div>Турніри</div>
        </Link>
      </div>

      <div className="sidebar-link">
        <Link to="/profile" className="sidebar-link-anchor">
          <img src='/assets/icons/profile-icon.svg' alt="Profile icon" />
          <div>Мій Профіль</div>
        </Link>
      </div>
    </nav>
  );
}

export default Sidebar;
