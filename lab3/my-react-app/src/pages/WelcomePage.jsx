import React from "react";
import { Link } from "react-router-dom";

import '../styles/welcome-page.css';

function WelcomePage() {
  return (
    <section className="welcome-page">
      <h1>Ласкаво просимо до KGames</h1>
      <div className="content-left">
        <p className="description-text">
        Пориньте у світ популярних і захопливих безкоштовних онлайн-ігор, щоб чудово провести час!
        </p>
        <div className="play-button-container">
          <Link to="/games" className="play-button">Грати зараз</Link>
        </div>
      </div>
    </section>
  );
}

export default WelcomePage;
