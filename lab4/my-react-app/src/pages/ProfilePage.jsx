import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../firebase/auth";
import { getUserProfile, getGameHistory, getAchievements } from "../firebase/database";
import PlayerStats from "../components/PlayerStats";

import '../styles/my-profile.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [games, setGames] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = getCurrentUser();
        if (user) {
          const userData = await getUserProfile(user.uid);
          if (userData) {
            setProfile(userData);
          } else {
            setProfile({
              username: user.displayName || user.email.split('@')[0],
              level: 1,
              xp: 0,
              gamesPlayed: 0,
              awards: 0,
              tournaments: 0
            });
          }
          
          const gamesData = await getGameHistory(user.uid);
          setGames(gamesData);
          
          const achievementsData = await getAchievements(user.uid);
          setAchievements(achievementsData);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) {
    return <div className="loading">Завантаження...</div>;
  }

  return (
    <main className="my-profile-container">
      {profile && (
        <PlayerStats
          username={profile.username}
          level={profile.level || 1}
          xp={profile.xp || 0}
          gamesPlayed={profile.gamesPlayed || 0}
          awards={profile.awards || 0}
          tournaments={profile.tournaments || 0}
        />
      )}

      <section className="user-activity">
        <div className="game-history">
          <h2 className="section-header">
            <img src='/assets/icons/history-log.svg' alt="Game History Icon" />
            Історія ігор
          </h2>

          {games.length > 0 ? (
            games.map((game) => (
              <div key={game.id} className="game-history-item">
                <img src={game.iconUrl || '/assets/images/default-game.png'} alt={game.name} className="game-icon" />
                <div className="game-detailed">
                  <div className="game-name">{game.name}</div>
                  <div className="game-date">
                    {new Date(game.timestamp).toLocaleString('uk-UA')}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">Ще немає історії ігор</div>
          )}
        </div>

        <div className="achievements">
          <h2 className="section-header">
            <img src='/assets/icons/trophy-icon.svg' alt="trophy-icon" />
            Нагороди
          </h2>

          <div className="achievements-grid">
            {achievements.length > 0 ? (
              achievements.map((achievement) => (
                <div key={achievement.id} className="achievement-card">
                  <img src={achievement.iconUrl || '/assets/icons/achievement-award-icon.svg'} alt={achievement.name} className="achievement-icon" />
                  <div className="achievement-name">{achievement.name}</div>
                  <div className="achievement-descr">{achievement.description}</div>
                </div>
              ))
            ) : (
              <div className="no-data">Ще немає нагород</div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProfilePage;