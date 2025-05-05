import { getFirestore, collection, doc, setDoc, getDoc, addDoc, updateDoc, onSnapshot, getDocs } from "firebase/firestore";
import app from './config';

const db = getFirestore(app);

export async function saveUserProfile(userId, profileData) {
  try {
    const userRef = doc(db, "users", userId);
    
    await setDoc(userRef, {
      ...profileData,
      updatedAt: new Date().toISOString()
    }, { merge: true }); 
    
    console.log("Data written successfully!");
    return true;
  } catch (error) {
    console.error("Error writing data:", error);
    throw error;
  }
}

export async function getUserProfile(userId) {
  try {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      console.log("User Data:", docSnap.data());
      return docSnap.data();
    } else {
      console.log("No data found.");
      return null;
    }
  } catch (error) {
    console.error("Error reading data:", error);
    throw error;
  }
}

export async function addGameToHistory(userId, gameData) {
  try {
    const gamesCollectionRef = collection(db, "users", userId, "games");
    const newGameRef = await addDoc(gamesCollectionRef, {
      ...gameData,
      timestamp: new Date().toISOString()
    });
    
    console.log("Game added with ID:", newGameRef.id);
    return newGameRef.id;
  } catch (error) {
    console.error("Error adding game:", error);
    throw error;
  }
}

export async function getGameHistory(userId) {
  try {
    const gamesCollectionRef = collection(db, "users", userId, "games");
    const querySnapshot = await getDocs(gamesCollectionRef);
    
    const games = [];
    querySnapshot.forEach((doc) => {
      games.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log("Games Data:", games);
    return games;
  } catch (error) {
    console.error("Error reading games:", error);
    throw error;
  }
}

export async function addAchievement(userId, achievementId, achievementData) {
  try {
    const achievementRef = doc(db, "users", userId, "achievements", achievementId);
    await setDoc(achievementRef, {
      ...achievementData,
      achievedAt: new Date().toISOString()
    });
    
    console.log("Achievement added:", achievementId);
    return true;
  } catch (error) {
    console.error("Error adding achievement:", error);
    throw error;
  }
}

export async function getAchievements(userId) {
  try {
    const achievementsCollectionRef = collection(db, "users", userId, "achievements");
    const querySnapshot = await getDocs(achievementsCollectionRef);
    
    const achievements = [];
    querySnapshot.forEach((doc) => {
      achievements.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log("Achievements Data:", achievements);
    return achievements;
  } catch (error) {
    console.error("Error reading achievements:", error);
    throw error;
  }
}

export async function updateUserStats(userId, statsUpdate) {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      ...statsUpdate,
      updatedAt: new Date().toISOString()
    });
    
    console.log("Stats updated successfully!");
    return true;
  } catch (error) {
    console.error("Error updating stats:", error);
    throw error;
  }
}

export function listenToUserProfile(userId, callback) {
  const userRef = doc(db, "users", userId);
  
  const unsubscribe = onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("Error listening to profile:", error);
  });
  return unsubscribe;
}