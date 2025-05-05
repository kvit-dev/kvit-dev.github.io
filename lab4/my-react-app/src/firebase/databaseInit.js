import { saveUserProfile, addGameToHistory, addAchievement } from './database';
import { initAuthStateListener } from './auth';

export async function initializeUserData(user) {
  try {
    await saveUserProfile(user.uid, {
      username: user.displayName || user.email.split('@')[0],
      level: 1,
      xp: 0,
      gamesPlayed: 0,
      awards: 0,
      tournaments: 0,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    });
    
    console.log("User profile initialized for:", user.uid);
    return true;
  } catch (error) {
    console.error("Error initializing user data:", error);
    throw error;
  }
}

export function setupAuthListener() {
  return initAuthStateListener(async (user) => {
    if (user) {
      try {
        await saveUserProfile(user.uid, {
          lastLogin: new Date().toISOString()
        });
      } catch (error) {
        console.error("Error updating login time:", error);
      }
    }
  });
}

export async function seedSampleData(userId) {
  try {
    await saveUserProfile(userId, {
      username: "kv338",
      level: 7,
      xp: 720,
      gamesPlayed: 12,
      awards: 2,
      tournaments: 1
    });
    
    await addGameToHistory(userId, {
      name: "Spades",
      iconUrl: "/assets/images/spades-puzzle.avif",
      result: "win",
      score: 105,
      timestamp: new Date("2025-01-01T13:00:00").toISOString()
    });
    
    await addGameToHistory(userId, {
      name: "Paper.io",
      iconUrl: "/assets/images/paper-io.avif",
      result: "loss",
      score: 67,
      timestamp: new Date("2025-01-02T17:10:00").toISOString()
    });
    
    await addAchievement(userId, "the-guesser", {
      name: "The Guesser",
      description: "Відгадайте всі слова за 10 секунд у грі Words Of Wonders",
      iconUrl: "/assets/icons/achievement-award-icon.svg"
    });
    
    await addAchievement(userId, "chefs-kiss", {
      name: "Chef's Kiss",
      description: "Не розчаруйте жодного відвідувача Papa's Donuteria",
      iconUrl: "/assets/icons/achievement-award-icon.svg"
    });
    
    console.log("Sample data seeded successfully!");
    return true;
  } catch (error) {
    console.error("Error seeding sample data:", error);
    throw error;
  }
}


