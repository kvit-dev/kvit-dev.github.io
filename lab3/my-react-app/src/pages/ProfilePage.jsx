import React from "react";
import PlayerStats from "../components/PlayerStats";

import '../styles/my-profile.css';

const ProfilePage = () => {
  return (
    <main className="my-profile-container">
      <PlayerStats
        username="kv338"
        level={7}
        xp={720}
        gamesPlayed={12}
        awards={2}
        tournaments={1}
      />

      <section className="user-activity">
        <div className="game-history">
          <h2 className="section-header">
            <img src='/assets/icons/history-log.svg' alt="Game History Icon" />
            Історія ігор
          </h2>

          <div className="game-history-item">
            <img src='/assets/images/spades-puzzle.avif' alt="Spades" className="game-icon" />
            <div className="game-detailed">
              <div className="game-name">Spades</div>
              <div className="game-date">01/01/2025, 13:00</div>
            </div>
            <div className="game-result-win">Перемога</div>
          </div>

          <div className="game-history-item">
            <img src='/assets/images/paper-io.avif' alt="Paper.io" className="game-icon" />
            <div className="game-detailed">
              <div className="game-name">Paper.io</div>
              <div className="game-date">01/02/2025, 17:10</div>
            </div>
            <div className="game-result-loss">Поразка</div>
          </div>
        </div>

        <div className="achievements">
          <h2 className="section-header">
            <img src='/assets/icons/trophy-icon.svg' alt="trophy-icon" />
            Нагороди
          </h2>

          <div className="achievements-grid">
            <div className="achievement-card">
              <img src='/assets/icons/achievement-award-icon.svg' alt="The Guesser" className="achievement-icon" />
              <div className="achievement-name">The Guesser</div>
              <div className="achievement-descr">
                Відгадайте всі слова за 10 секунд у грі Words Of Wonders
              </div>
            </div>

            <div className="achievement-card">
              <img src='/assets/icons/achievement-award-icon.svg' alt="Chef's Kiss" className="achievement-icon" />
              <div className="achievement-name">Chef's Kiss</div>
              <div className="achievement-descr">
                Не розчаруйте жодного відвідувача Papa's Donuteria
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProfilePage;