import React from 'react';

const TournamentCard = ({ tournament }) => {
  return (
    <div className="tournament-card">
      <div className="tournament-header">
        <img src={tournament.icon} alt={tournament.iconAlt} className="tournament-icon" />
        <h2 className="tournament-name">{tournament.name}</h2>
        <span className="tournament-prize">Приз: ${tournament.prize}</span>
      </div>

      <div className="tournament-info">
        <div className="info-item">
          <span className="info-label">Дата:</span>
          <span className="info-value">{tournament.date}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Час:</span>
          <span className="info-value">{tournament.time}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Формат:</span>
          <span className="info-value">{tournament.format}</span>
        </div>
      </div>

      <div className="tournament-description">
        <p>{tournament.description}</p>
      </div>

      <div className="tournament-requirements">
        <h3>Вимоги:</h3>
        <ul>
          {tournament.requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </div>

      <div className="tournament-registration">
        <span className="available-slots">{tournament.registeredSlots}/{tournament.totalSlots} зареєстровано учасників</span>
        <button className="register-button">Зареєструватись</button>
      </div>
    </div>
  );
};

export default TournamentCard;
