import React, { useEffect, useRef } from "react";

const PlayerStats = ({ username, level, xp, gamesPlayed, awards, tournaments }) => {
  const progressBarRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const gamesPerAward = 5;
    const nextAwardAt = (Math.floor(gamesPlayed / gamesPerAward) + 1) * gamesPerAward;
    const gamesNeeded = nextAwardAt - gamesPlayed;
    const progressSinceLastAward = gamesPlayed % gamesPerAward;
    const progressPercentage = (progressSinceLastAward / gamesPerAward) * 100;

    if (labelRef.current) {
      labelRef.current.textContent = `${progressSinceLastAward}/${gamesPerAward} games`;
    }

    if (progressBarRef.current) {
      setTimeout(() => {
        progressBarRef.current.style.width = `${progressPercentage}%`;
      }, 300);
    }
  }, [gamesPlayed]);

  return (
    <section className="user-info">
      <img src='/assets/icons/profile-icon.svg' alt="My Profile" className="my-profile-picture" />
      <h1 className="profile-username">{username}</h1>

      <div className="user-level">
        <span className="level-badge">Рівень {level}</span>
        <span>{xp} досвіду</span>
      </div>

      <div className="progress">
        <div className="progress-fill" ref={progressBarRef}></div>
        <div className="progress-label" ref={labelRef}></div>
      </div>
      <p>Тобі потрібно {(Math.floor(gamesPlayed / 5) + 1) * 5 - gamesPlayed} ігри(ор), щоб отримати наступну нагороду</p>

      <div className="stats-grid">
        <div className="stats-card">
          <div className="stats-quantity">{gamesPlayed}</div>
          <div className="stats-label">Ігор зіграно</div>
        </div>
        <div className="stats-card">
          <div className="stats-quantity">{awards}</div>
          <div className="stats-label">Нагороди</div>
        </div>
        <div className="stats-card">
          <div className="stats-quantity">{tournaments}</div>
          <div className="stats-label">Турніри</div>
        </div>
      </div>
    </section>
  );
};

export default PlayerStats;
