const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

/*app.use(express.static(path.join(__dirname, "build")));*/

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying auth token:', error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ message: "You have accessed a protected route!", user: req.user });
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord =await admin.auth().createUser({ email, password});
    res.status(201).json({ message: "User created", uid: userRecord.uid});
  } catch (error) {
    console.error("Error creating user: ", error);
    res.status(400).json({ error: error.message });
  }
});

app.post("/login", (req, res) => {
  res.status(501).json({ message: "Login should be handled on client using Firebase Auth SDK"});
});
 
app.get("/profile", verifyToken, async (req, res) => {
  try {
    const userRecord = await admin.auth().getUser(req.user.uid);
    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName || null
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({error: "Failed to fetch profile"});
  }
});

app.get("/api/games/:gameTitle/rating", async (req, res) => {
  try {
    const { gameTitle } = req.params;
    const normalizedGameTitle = gameTitle.trim();
    
    const ratingsRef = db.collection('gameRatings').doc(normalizedGameTitle);
    const doc = await ratingsRef.get();
    
    if (!doc.exists) {
      return res.json({ rating: 0, totalRatings: 0 });
    }
    
    const data = doc.data();
    res.json({
      rating: data.averageRating || 0,
      totalRatings: data.totalRatings || 0
    });
  } catch (error) {
    console.error('Error getting rating:', error);
    res.status(500).json({ error: 'Failed to get rating' });
  }
});

app.post("/api/games/:gameTitle/rate", verifyToken, async (req, res) => {
  try {
    const { gameTitle } = req.params;
    const { rating } = req.body;
    const userId = req.user.uid;
    
    const normalizedGameTitle = gameTitle.trim();
    
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
    }
    
    const userRatingRef = db.collection('userRatings').doc(userId);

    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRatingRef);
      const userData = userDoc.exists ? userDoc.data() : { ratings: {} };
      const oldRating = userData.ratings?.[normalizedGameTitle] || 0;
      
      transaction.set(userRatingRef, {
        ratings: {
          ...userData.ratings,
          [normalizedGameTitle]: rating
        }
      }, { merge: true });
      
      const gameRatingRef = db.collection('gameRatings').doc(normalizedGameTitle);
      const gameDoc = await transaction.get(gameRatingRef);
      
      if (!gameDoc.exists) {
        transaction.set(gameRatingRef, {
          averageRating: rating,
          totalRatings: 1,
          sumRatings: rating
        });
      } else {
        const gameData = gameDoc.data();
        let { sumRatings, totalRatings } = gameData;
        
        if (oldRating > 0) {
          sumRatings = sumRatings - oldRating + rating;
        } else {
          sumRatings = sumRatings + rating;
          totalRatings += 1;
        }
        
        const newAverageRating = Math.round((sumRatings / totalRatings) * 10) / 10;
        
        transaction.update(gameRatingRef, {
          averageRating: newAverageRating,
          totalRatings,
          sumRatings
        });
      }
    });
    
    const updatedRatingDoc = await db.collection('gameRatings').doc(normalizedGameTitle).get();
    const updatedData = updatedRatingDoc.data();
    
    res.json({
      rating: updatedData.averageRating,
      totalRatings: updatedData.totalRatings
    });
    
  } catch (error) {
    console.error('Error rating game:', error);
    res.status(500).json({ error: 'Failed to rate game' });
  }
});

app.get("/api/user/ratings", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    
    const userRatingRef = db.collection('userRatings').doc(userId);
    const doc = await userRatingRef.get();
    
    if (!doc.exists) {
      return res.json({ ratings: {} });
    }
    
    res.json({ ratings: doc.data().ratings || {} });
  } catch (error) {
    console.error('Error getting user ratings:', error);
    res.status(500).json({ error: 'Failed to get user ratings' });
  }
});

/*app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});*/

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});